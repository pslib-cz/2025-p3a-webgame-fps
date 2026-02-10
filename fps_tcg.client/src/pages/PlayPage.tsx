import { useState, useEffect, useRef } from 'react'
import { type FC } from "react"
import style from '../styles/PlayPage.module.css'
import cardBack90 from '../assets/cardback-90.png'
import Hand from "../components/Hand"
import type { DiceSymbol, Turn, GameStatus, GameResult } from '../types'
import Dice from '../components/Dice'
import dmg from '../assets/damage.png'
import cost from '../assets/price.png'
import type { CardProps } from "../components/Card";
import { EnemyAI, type EnemyCard } from '../enemy/Enemy';
import { Link, useNavigate } from 'react-router'

type PlayPageProps = {
    onCardPicked: () => void;
    diceSymbols: DiceSymbol[];
    enemyDice: DiceSymbol[];
    setEnemyDice: (value: DiceSymbol[]) => void;
    firstTurn: boolean;
    setFirstTurn: (value: boolean) => void;
    activeCard: number | null;
    setActiveCard: (value: number | null) => void;
    deadCards: number[];
    setDeadCards: (value: number[] | ((prev: number[]) => number[])) => void;
    cards: any[];
    setCards: (value: any[] | ((prev: any[]) => any[])) => void;
    characterList: CardProps[];
    setCharacterList: (value: CardProps[] | ((prev: CardProps[]) => CardProps[])) => void;
    supportHand: CardProps[];
    setSupportHand: (value: CardProps[] | ((prev: CardProps[]) => CardProps[])) => void;
    firstDraw: boolean;
    setFirstDraw:(value: boolean) => void;
    currentTurn: Turn;
    setCurrentTurn: (value: Turn) => void;
    gameStatus: GameStatus;
    setGameStatus: (value: GameStatus) => void;
    gameResult: GameResult;
    setGameResult: (value: GameResult) => void;
    activeEnemyId: number | null;
    setActiveEnemyId: (value: number | null) => void;
}

export const PlayPage: FC<PlayPageProps> = (
    { onCardPicked, diceSymbols, enemyDice, setEnemyDice, firstTurn, setFirstTurn, activeCard, setActiveCard, 
        deadCards, setDeadCards, cards, setCards, supportHand, setSupportHand, characterList, setCharacterList, firstDraw, setFirstDraw,
        currentTurn, setCurrentTurn, gameStatus, setGameStatus, gameResult, setGameResult, activeEnemyId, setActiveEnemyId
    }) => {
    const [showAllSupport, setShowAllSupport] = useState(false);
    const [styles, setStyles] = useState(style.supportCards)
    const [selectedSup, setSelectedSup] = useState<number | null>(null)
    const [attackMenu, setAttackMenu] = useState<number | null>(null)
    const [showAttackMenu, setShowAttackMenu] = useState(false)
    const [pendingCard, setPendingCard] = useState<number | null>(null)
    const [selectedDiceIndex, setSelectedDiceIndex] = useState<number[]>([])
    const [targetId, setTargetId] = useState<number | null>(null);
    const [supportDeck, setSupportDeck] = useState<CardProps[]>([]);
    const [loadedDeck, setLoadedDeck] = useState(false)
    const [pendingSupportEffect, setPendingSupportEffect] = useState<string | null>(null)
    const [pendingSupportCardIndex, setPendingSupportCardIndex] = useState<number | null>(null)
    const [pendingSupportDiceIndices, setPendingSupportDiceIndices] = useState<number[]>([])
    const [enemyAttackCounter, setEnemyAttackCounter] = useState(0);
    const [playerEndedRound, setPlayerEndedRound] = useState(false);
    const [enemyEndedRound, setEnemyEndedRound] = useState(false);
    const [firstPlayerNextRound, setFirstPlayerNextRound] = useState<Turn>('player');
    const [enemyTurnReset, setEnemyTurnReset] = useState(0);
    const enemyTurnProcessed = useRef(false);
    const playerEndedRoundRef = useRef(false);
    const enemyEndedRoundRef = useRef(false);
    const navigate = useNavigate();
    const restoreGame = useRef(false)
    const [shouldSkipFetch, setShouldSkipFetch] = useState<boolean | null>(null);

    const saveGame = () => {
        const gameState = {
            cards,
            characterList,
            supportHand,
            supportDeck,
            activeCard,
            activeEnemyId,
            deadCards: [...deadCards],
            diceSymbols: [...diceSymbols],
            enemyDice: [...enemyDice],
            currentTurn,
            gameStatus,
            gameResult,
            firstTurn,
            firstDraw,
            loadedDeck,
            enemyAttackCounter,
            playerEndedRound,
            enemyEndedRound,
            firstPlayerNextRound,
            pendingSupportEffect,
            pendingSupportCardIndex,
            pendingSupportDiceIndices
        }
        try{
            localStorage.setItem('gameProgress', JSON.stringify(gameState))
        } catch(error){
            console.error('Failed to save game:', error);
        }
    }

    const loadGame = () => {
        try{
            const saved = localStorage.getItem('gameProgress')
            if(!saved){
                alert('No saved game found!')
                return false;
            }
            const gameState = JSON.parse(saved)
            setCards(gameState.cards || []);
            setCharacterList(gameState.characterList || []);
            setSupportHand(gameState.supportHand || []);
            setSupportDeck(gameState.supportDeck || []);
            setActiveCard(gameState.activeCard);
            setActiveEnemyId(gameState.activeEnemyId);
            setDeadCards(gameState.deadCards || []);
            setCurrentTurn(gameState.currentTurn || 'player');
            setGameStatus(gameState.gameStatus || 'playerTurn');
            setGameResult(gameState.gameResult);
            setFirstTurn(gameState.firstTurn);
            setFirstDraw(gameState.firstDraw);
            setLoadedDeck(gameState.loadedDeck);
            setEnemyAttackCounter(gameState.enemyAttackCounter || 0);
            setPlayerEndedRound(gameState.playerEndedRound || false);
            setEnemyEndedRound(gameState.enemyEndedRound || false);
            setFirstPlayerNextRound(gameState.firstPlayerNextRound || 'player');
            setPendingSupportEffect(gameState.pendingSupportEffect || null);
            setPendingSupportCardIndex(gameState.pendingSupportCardIndex || null);
            setPendingSupportDiceIndices(gameState.pendingSupportDiceIndices || []);
            if(gameState.diceSymbols){
                diceSymbols.length = 0;
                gameState.diceSymbols.forEach((d: DiceSymbol) => diceSymbols.push(d));
            }
            if(gameState.enemyDice){
                setEnemyDice(gameState.enemyDice)
            }
            if (gameState.cards && gameState.activeEnemyId) {
                setCards(gameState.cards.map((c: any) => ({
                    ...c,
                    isTarget: c.id === gameState.activeEnemyId 
                })));
            }
            return true;
        }
        catch(error){
            console.error('Failed to load game:', error);
            alert('Failed to load game!');
            return false;
        }
    }

    const clearSavedGame = () => {
        try{
            localStorage.removeItem('gameProgress')
            console.log('Save deleted');
        }catch(error){
            console.error('Failed to delete save:', error);
        }
    }

    useEffect(() => {
        if(restoreGame.current) return;
        const saved = localStorage.getItem('gameProgress')
        if(saved && cards.length === 0 && !loadedDeck){
            restoreGame.current = true;
            const wantsToLoad = confirm('Continue from last save?');
            if (wantsToLoad) {
                setShouldSkipFetch(true);
                loadGame();
            }else {
                setShouldSkipFetch(false);
                clearSavedGame();
            }
        }else if(!saved){
            setShouldSkipFetch(false);
        }
    }, [])

    useEffect(() => {
        if (cards.length === 0 && characterList.length === 0) return;
        const autoSaveTimer = setTimeout(() => {
                saveGame();
            }, 100);
            
        return () => clearTimeout(autoSaveTimer);
    }, [cards, characterList, activeCard, activeEnemyId, deadCards, currentTurn, supportHand, gameStatus, playerEndedRound, enemyEndedRound, pendingSupportEffect, pendingSupportCardIndex, pendingSupportDiceIndices]);

    const rollEnemyDice = (): DiceSymbol[] => {
        const diceTypes: DiceSymbol[] = ['Knight', 'Tank', 'Mage', 'Healer', 'Rogue', 'Jester'];
        const rolled: DiceSymbol[] = [];
        
        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * diceTypes.length);
            rolled.push(diceTypes[randomIndex]);
        }
        
        return rolled;
    };

    const startNewRound = () => {
        drawSupportCards(1)
        setPlayerEndedRound(false);
        setEnemyEndedRound(false);
        enemyTurnProcessed.current = false;
        
        const enemyRoll = rollEnemyDice();
        setEnemyDice(enemyRoll);
        
        setCurrentTurn(firstPlayerNextRound);
        setGameStatus(firstPlayerNextRound === 'player' ? 'playerTurn' : 'enemyTurn');
        
        onCardPicked();
    };

    const handlePlayerEndRound = () => {
        if (playerEndedRound || gameStatus === 'gameOver') return;
        
        if (isActiveCardDead()) {
            alert("Your active card is dead! You must switch to another card before ending the round.");
            return;
        }
        
        if (pendingSupportEffect && pendingSupportCardIndex !== null) {
            alert(`You must select a target for ${pendingSupportEffect}!`);
            return;
        }
        
        setPlayerEndedRound(true);
        
        if (!enemyEndedRound) {
            setFirstPlayerNextRound('player');
        }
        
        if (currentTurn === 'enemy' && !enemyEndedRound) {
            enemyTurnProcessed.current = false;
        }
        
        if (!enemyEndedRound) {
            setTimeout(() => {
                setCurrentTurn('enemy');
                setGameStatus('enemyTurn');
            }, 500);
        } else {
            setTimeout(() => startNewRound(), 1000);
        }
    };

    const handleEnemyEndRound = () => {
        if (enemyEndedRound || gameStatus === 'gameOver') return;
        
        if (isActiveCardDead()) {
            setEnemyEndedRound(true);
            return;
        }
        
        setEnemyEndedRound(true);
        
        if (!playerEndedRoundRef.current) {
            setFirstPlayerNextRound('enemy');
        }
        
        if (!playerEndedRoundRef.current) {
            setTimeout(() => {
                setCurrentTurn('player');
                setGameStatus('playerTurn');
            }, 500);
        } else {
            setTimeout(() => startNewRound(), 1000);
        }
    };

    const resolveEnemyActiveCardId = (aliveEnemies: EnemyCard[]) => {
        if (aliveEnemies.length === 0) return null;
        if (activeEnemyId != null && aliveEnemies.some(e => e.id === activeEnemyId)) {
            return activeEnemyId;
        }
        return aliveEnemies[0].id;
    };

    useEffect(() => {
        playerEndedRoundRef.current = playerEndedRound;
        enemyEndedRoundRef.current = enemyEndedRound;
    }, [playerEndedRound, enemyEndedRound]);

    useEffect(() => {
        if (currentTurn === 'player') {
            enemyTurnProcessed.current = false;
        }
    }, [currentTurn]);

    useEffect(() => {
        if (currentTurn === 'enemy' && isActiveCardDead()) {
            setCurrentTurn('player');
            setGameStatus('playerTurn');
            setActiveCard(null);
            setPlayerEndedRound(false);
            enemyTurnProcessed.current = false;
            return;
        }

        if (currentTurn === 'enemy' && !enemyEndedRound && gameStatus !== 'gameOver') {
            if (enemyTurnProcessed.current) return;
            enemyTurnProcessed.current = true;

            const executeEnemyTurn = async () => {
                await new Promise(resolve => setTimeout(resolve, 1500));

                const enemyCards: EnemyCard[] = cards.map(c => ({
                    id: c.id,
                    name: c.name || 'Enemy',
                    type: c.type || 'attack',
                    health: c.health,
                    maxHealth: c.maxHealth || c.health,
                    shield: c.shield,
                    skill1Name: c.skill1Name,
                    skill1Damage: c.skill1Damage,
                    skill1Cost: c.skill1Cost,
                    skill2Name: c.skill2Name,
                    skill2Damage: c.skill2Damage,
                    skill2Cost: c.skill2Cost,
                    skill2Effect: c.skill2Effect,
                    isAlive: c.isAlive
                }));

                const aliveEnemies = enemyCards.filter(c => c.isAlive && c.health > 0);
                if (aliveEnemies.length === 0) {
                    setCurrentTurn('player');
                    setGameStatus('playerTurn');
                    return;
                }

                const resolvedEnemyActiveCard = resolveEnemyActiveCardId(aliveEnemies);
                if (resolvedEnemyActiveCard == null) {
                    return;
                }
                setActiveEnemyId(resolvedEnemyActiveCard);

                const activePlayerCard = characterList.find((c: any) => c.id === activeCard);
                if (activeCard == null || !activePlayerCard || (activePlayerCard.health ?? 0) <= 0) {
                    setCurrentTurn('player');
                    setGameStatus('playerTurn');
                    setActiveCard(null);
                    setPlayerEndedRound(false);
                    return;
                }

                const ai = new EnemyAI(enemyCards, resolvedEnemyActiveCard, enemyDice, enemyAttackCounter, 0.75);

                const playerCardsForAI = characterList.map(c => ({
                    id: c.id,
                    name: c.name,
                    health: c.health,
                    maxHealth: c.maxHealth || c.health,
                    shield: c.shield,
                    skill1Damage: c.skill1Damage,
                    skill2Damage: c.skill2Damage,
                    skill2Effect: c.skill2Effect,
                    isAlive: (c.health ?? 0) > 0
                }));

                const action = ai.evaluateAttack(playerCardsForAI, activeCard);

                if (action) {
                    if (action.usedDiceIndices && action.usedDiceIndices.length > 0) {
                        ai.removeDice(action.usedDiceIndices);
                    }
                    
                    if (action.actionType === 'endTurn') {
                        handleEnemyEndRound();
                        return;
                    }
                    
                    const newEnemyDice = enemyDice.filter((_: DiceSymbol, idx: number) => !action.usedDiceIndices?.includes(idx));
                    const remainingDice = newEnemyDice.length;
                    
                    setEnemyDice(newEnemyDice);
                    
                    handleEnemyAction(action);
                    setEnemyAttackCounter(ai.getTurnCounter());
                    
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    if (remainingDice <= 0) {
                        handleEnemyEndRound();
                        return;
                    }
                    
                    if (!playerEndedRoundRef.current) {
                        enemyTurnProcessed.current = false;
                        setCurrentTurn('player');
                        setGameStatus('playerTurn');
                    } else {
                        enemyTurnProcessed.current = false;
                        setEnemyTurnReset(prev => prev + 1);
                    }
                } else {
                    handleEnemyEndRound();
                }
            };

            executeEnemyTurn();
        }
    }, [currentTurn, enemyEndedRound, gameStatus, cards, characterList, activeCard, enemyDice, enemyAttackCounter, playerEndedRound, enemyTurnReset]);

    useEffect(() => {
        const fetchCards = async () => {
            if (cards.length > 0 || shouldSkipFetch !== false) return;
            try {
                const response = await fetch('/api/Cards');
                if (!response.ok) {
                    throw new Error('Failed to fetch cards');
                }
                const data = await response.json();
                const normalizedCards = data
                .filter((card:any) => card.type === 'attack')
                .splice(0,3)
                .map((card: { cardId: any, health: any, shield: any }) => ({
                    ...card,
                    id: card.cardId,
                    maxHealth: card.health,
                    isTarget: false,
                    isAlive: !deadCards.includes(card.cardId),
                    imgSrc: `/api/images/${card.cardId}.png`,
                    health: deadCards.includes(card.cardId) ? 0 : card.health,
                    shield: deadCards.includes(card.cardId) ? 0 : card.shield
                }));
                setCards(normalizedCards);
            } catch (error) {
            }
        };
        fetchCards();
    }, [shouldSkipFetch]);
    
    useEffect(() => {
        const fetchDeck = async () => {
            if (loadedDeck && characterList.length > 0 && !shouldSkipFetch) return;
            try{
                const stored = localStorage.getItem('activeDeck');
                if (!stored) {
                    alert('No active deck selected');
                    navigate('/')
                    return;
                }
                const activeDeck = JSON.parse(stored);
                const response = await fetch(`/api/Decks/${activeDeck.deckId}/with-cards`)
                if(!response.ok){
                    throw new Error('Failed to fetch deck')
                }
                const data = await response.json();
                const cardsArray = Array.isArray(data) ? data : (data.cards || []);
                const normalizedDeck = cardsArray.map((card: { cardId: number; health: number; shield: number; type: string }) => {
                    const currentCard  = characterList.find(c => c.id === card.cardId);
                    let health = card.health;
                    if (currentCard) {
                        health = currentCard.health!;
                    }
                    let shield = card.shield;
                    if (currentCard) {
                        shield = currentCard.shield!;
                    }

                    return{
                        ...card,
                        id: card.cardId,
                        maxHealth: card.health,
                        isAlive: !deadCards.includes(card.cardId),
                        health,
                        shield,
                        imgSrc: `/api/images/${card.cardId}.png`
                    }
                });

                const char = normalizedDeck.filter((card: { type: string }) => card.type !== 'support');
                const supportCards = normalizedDeck.filter((card: { type: string }) => card.type === 'support');

                setCharacterList(char);
                setSupportDeck(supportCards);
                setLoadedDeck(true);
            } catch(error){
            }
        };
        fetchDeck();
    }, [shouldSkipFetch]);

    useEffect(() => {
        if (cards.length === 0 || characterList.length === 0) return;

        const aliveEnemies = cards.filter(c => c.isAlive && c.health > 0);
        const aliveAllies = characterList.filter(c => c.health! > 0)

        if (aliveEnemies.length === 0) {
            setGameStatus('gameOver');
            setGameResult('win');
            return;
        }
        if(aliveAllies.length === 0){
            setGameStatus('gameOver');
            setGameResult('lose');
            return;
        }
        const currentEnemyIsStillAlive = aliveEnemies.some(e => e.id === activeEnemyId);
        if (activeEnemyId === null || !currentEnemyIsStillAlive) {
            if(shouldSkipFetch === false || (shouldSkipFetch === true && activeEnemyId === null)){
                const randomIndex = Math.floor(Math.random() * aliveEnemies.length);
                setActiveEnemyId(aliveEnemies[randomIndex].id);
            }
        }
    }, [cards, characterList, activeEnemyId, gameStatus]);

    useEffect(() => {
        if (!firstTurn && !playerEndedRound && currentTurn === 'player' && diceSymbols.length === 0 && gameStatus !== 'gameOver') {
            setTimeout(() => handlePlayerEndRound(), 1000);
        }
    }, [diceSymbols.length, currentTurn, playerEndedRound, firstTurn, gameStatus]); 

    const handleCharacterSelect = (cardId: number) => {
        const card = characterList.find(c => c.id === cardId);
        if (!card) return;
    
        const isDead = card.health! <= 0;
    
        if (isActiveCardDead()) {
            if (isDead) {
                alert("This card is defeated. Choose a living card.");
                return;
            }
            setActiveCard(cardId);
            setPendingCard(null);
            setShowAttackMenu(false);
            setAttackMenu(null);
            setPlayerEndedRound(false);
            return;
        }
    
        if (currentTurn !== 'player' && !firstTurn) {
            alert("It's enemy turn! Wait for your turn.");
            return;
        }
    
        if (isDead) {
            alert("This card is defeated.");
            return;
        }
    
        if (pendingSupportEffect && pendingSupportCardIndex !== null) {
            if (pendingSupportEffect === "heal") {
                healAlly(cardId, 1);
            } else if (pendingSupportEffect === "shield") {
                giveShieldToAlly(cardId, 1);
            }
            
            const newDice = diceIndexDel(diceSymbols, pendingSupportDiceIndices);
            diceSymbols.length = 0;
            for (let i = 0; i < newDice.length; i++) {
                diceSymbols.push(newDice[i]);
            }
            
            setSupportHand(prev => prev.filter((_, i) => i !== pendingSupportCardIndex));
            setPendingSupportEffect(null);
            setPendingSupportCardIndex(null);
            setPendingSupportDiceIndices([]);
            return;
        }
    
        if (cardId == activeCard) {
            setPendingCard(null);
            setShowAttackMenu(true);
            setAttackMenu(cardId);
            return;
        }
    
        if (firstTurn) {
            setActiveCard(cardId);
            setTimeout(() => {
                setFirstTurn(false);
                const enemyRoll = rollEnemyDice();
                setEnemyDice(enemyRoll);
                onCardPicked();
            }, 800);
        } else {
            if (pendingSupportEffect && pendingSupportCardIndex !== null) {
                alert(`You must select a target for ${pendingSupportEffect}!`);
                return;
            }
            setPendingCard(cardId);
            if (!showAttackMenu) {
                setShowAttackMenu(false);
                setAttackMenu(null);
            }
        }
    };
    
    const handleTargetSelect = (cardId: number) => {
        if (!cardId) return;

        const activeChar = characterList.find(c => c.id === activeCard);
        const isRogue = activeChar?.skill2Effect?.toLowerCase() === "rogue";
        if (!isRogue) return;

        setCards(prev =>
            prev.map(c => ({
                ...c,
                isTarget: c.id === cardId ? !c.isTarget : false
            }))
        );
        setTargetId(prev => (prev === cardId ? null : cardId));
    }  
    
    const handleSupportClick = () => {
        if (isActiveCardDead()) {
            alert("Your active card is dead! Switch to another card first.");
            return;
        }

        if (pendingSupportEffect && pendingSupportCardIndex !== null) {
            alert(`You must select a target for ${pendingSupportEffect}!`);
            return;
        }
        setShowAllSupport(true);
        setStyles(style.supportCardsOpen)
    }

    const handleSupportClose = () =>{
        setShowAllSupport(false);
        setStyles(style.supportCards); 
    };
    
    const handleAttackMove = async (dmg: number, cost: number, effect?: string) => {
        if (isActiveCardDead()) {
            alert("Your active card is dead! Switch to another card first.");
            return;
        }

        if (currentTurn !== 'player') {
            alert("It's enemy turn! Wait for your turn.");
            return;
        }

        if (playerEndedRound) {
            alert("You have ended your round. Wait for enemy to finish.");
            return;
        }

        if (pendingSupportEffect && pendingSupportCardIndex !== null) {
            alert(`You must select a target for ${pendingSupportEffect}!`);
            return;
        }

        const effectType = effect?.toLowerCase()
        const enemyTarget = !effectType || effectType === "attack" || effectType === "mage" || effectType === "stealth" || effectType === "rogue";
        const allyTarget = effectType === "shield" || effectType === "heal";

        if (effectType === "rogue" && targetId === null) {
            alert("Choose enemy target");
            return;
        }

        if (allyTarget) {
            const target = pendingCard ?? activeCard;
            if (!target) {
                alert("Choose an active card or ally card!");
                return;
            }
        }

        const activeChar = characterList.find(c => c.id === activeCard);
        if (!activeChar || activeChar.health! <= 0) {
            alert("Active card is defeated.");
            return;
        }

        if (effect && selectedDiceIndex.length) {
            const selectedDice = selectedDiceIndex.map(i => diceSymbols[i]);

            const invalid = selectedDice.some(d => 
                (effectType === "attack" && d !== "Knight" && d !== "Jester") ||
                (effectType === "shield" && d !== "Tank" && d !== "Jester") ||
                (effectType === "mage" && d !== "Mage" && d !== "Jester") ||
                (effectType === "heal" && d !== "Healer" && d !== "Jester") ||
                (effectType === "rogue" && d !== "Rogue" && d !== "Jester")
            );

            if (invalid) {
                alert("This skill requires specific dice or Jester");
                return;
            }
        }

        if (selectedDiceIndex.length < cost) {
            alert(`Select ${cost} dice!`);
            return;
        }
        if (selectedDiceIndex.length > cost) {
            alert("Too many dice selected!");
            setSelectedDiceIndex([]);
            return;
        }

        if(selectedDiceIndex.length === cost){
            const newDice = diceIndexDel(diceSymbols, selectedDiceIndex);
            diceSymbols.length = 0;
            for(let i = 0; i < newDice.length; i++) {
                diceSymbols.push(newDice[i]);
            }
 
            setSelectedDiceIndex([])
            setTargetId(null)
        }
        
        switch (effectType) {
        case "attack":
            dmgDeal(activeEnemyId, dmg);
            break;

        case "shield":
            giveShieldToAlly(pendingCard || activeCard, dmg);
            break;

        case "guard":
            giveShieldToAlly(pendingCard || activeCard, dmg);
            break;

        case "heal":
            healAlly(pendingCard || activeCard, dmg);
            break;

        case "mage":
            const splashDamage = Math.floor(dmg / 2);
            setCards(prevCards => {
                let updatedCards = prevCards;
                if (activeEnemyId !== null) {
                    updatedCards = updatedCards.map(c => applyDmg(c, activeEnemyId, dmg));
                }
                const otherEnemies = updatedCards.filter(c => c.isAlive && c.health > 0 && c.id !== activeEnemyId);
                otherEnemies.forEach(enemy => {
                    updatedCards = updatedCards.map(c => applyDmg(c, enemy.id, splashDamage));
                });
                return updatedCards;
            });
            break;

        case "rogue":
            dmgDeal(targetId, dmg);
            break;
        default:
            dmgDeal(activeEnemyId, dmg);
            break;
        }

        const shouldCounterAttack = gameStatus !== "gameOver" && (enemyTarget || allyTarget);
        if (shouldCounterAttack) {
            setTargetId(null);
            if (!enemyEndedRound) {
                setTimeout(() => {
                    setCurrentTurn('enemy');
                    setGameStatus('enemyTurn');
                }, 500);
            }
        }
    }

    const giveShieldToAlly = (id: number | null, value: number) => {
        const choosenId = id ?? activeCard;
        if (choosenId == null) return;
        setCharacterList(prev =>
            prev.map(c =>
                c.id === choosenId ? { ...c, shield: (c.shield ?? 0) + value } : c
            )
        );
    };

    const healAlly = (id: number | null, value: number) => {
        const choosenId = id ?? activeCard;
        if (choosenId == null) return;
        setCharacterList(prev =>
            prev.map(c =>
                c.id === choosenId ? { ...c, health: c.health! + value } : c
            )
        );
    };

    const playSupport = () => {
        if (currentTurn !== 'player') {
            alert("It's enemy turn! Wait for your turn.");
            return;
        }

        if (pendingSupportEffect && pendingSupportCardIndex !== null) {
            alert(`You must select a target for ${pendingSupportEffect}!`);
            return;
        }

        if(selectedSup == null) return;

        const support = supportHand[selectedSup];
        if (!support) return;

        if (selectedDiceIndex.length < support.supportCost! || selectedDiceIndex.length > support.supportCost!) {
            alert(`You need ${support.supportCost} dice to play this support card!`);
            return;
        }
      
        const effectToDice: Record<string, DiceSymbol> = {
            stealth: "Rogue",
            attack: "Knight",
            shield: "Tank",
            magic: "Mage",
            heal: "Healer",
            Jester: 'Jester'
        };
        
        if (support.supportEffect?.toLowerCase() === "heal" || support.supportEffect?.toLowerCase() === "shield") {
            setPendingSupportEffect(support.supportEffect.toLowerCase());
            setPendingSupportCardIndex(selectedSup);
            setPendingSupportDiceIndices(selectedDiceIndex);
            setSelectedSup(null);
            setShowAllSupport(false);
            setStyles(style.supportCards);
            setSelectedDiceIndex([]);
            alert(`Select a character card to ${support.supportEffect.toLowerCase()}`);
            return;
        }
        
        if (support.supportEffect?.startsWith("give_")) {
            const effectName  = support.supportEffect.split("_")[1];
            const diceToGive = effectToDice[effectName];
            
            diceSymbols.push(diceToGive);
        }
        
        const newDice = diceIndexDel(diceSymbols, selectedDiceIndex);
        diceSymbols.length = 0;
        for (let i = 0; i < newDice.length; i++) {
            diceSymbols.push(newDice[i]);
        }
        setSelectedDiceIndex([]);
        
        setSupportHand(prev => prev.filter((_, i) => i !== selectedSup));
        setSupportHand(prev => prev.filter(c => c.id !== selectedSup));
        
        setSelectedSup(null)
        setShowAllSupport(false)
        setStyles(style.supportCards)
    }

    const drawSupportCards = (count: number, handLimit: number = 6) => {
        if (supportDeck.length === 0) return;
        const deckCopy = [...supportDeck];
        const spaceInHand = handLimit - supportHand.length;
        const drawCount = Math.min(count, spaceInHand);

        const newCards: CardProps[] = [];

        for (let i = 0; i < drawCount; i++) {
            const randomIndex = Math.floor(Math.random() * deckCopy.length);
            const card = deckCopy[randomIndex];
            newCards.push({ ...card });
            deckCopy.splice(randomIndex, 1);
        }
        setSupportDeck(deckCopy);
        
        setSupportHand(prev => [...prev, ...newCards]);
    }

    useEffect(() => {
        if (!loadedDeck) return;

        if (firstTurn && !firstDraw && supportHand.length === 0) {
            drawSupportCards(2);
            setFirstDraw(true)
        }
    }, [firstTurn, loadedDeck])

    const dmgDeal = (id: number | null, dmg: number, cardsOverride?: any[]) =>{
        if(id == null) return null;
        const baseCards = cardsOverride ?? cards;
        const isInCards = baseCards.some(c => c.id === id);
        
        if(isInCards) {
            const updatedCards = baseCards.map(c => applyDmg(c, id, dmg));
            setCards(updatedCards);
            return updatedCards;
        }
        return baseCards;
    }

    const enemyDmgToPlayer = (id: number | null, dmg: number) => {
        if(id == null) return;
        const isInCharacterList = characterList.some(c => c.id === id);
        
        if(isInCharacterList) {
            setCharacterList(prev =>  prev.map(c => applyDmgToPlayer(c, id, dmg)));
        }
    }

    const handleEnemyAction = (action: any) => {
        switch (action.actionType) {
            case 'attack':
                enemyDmgToPlayer(action.targetId, action.damage);
                break;
            case 'heal':
                enemyHealSelf(action.targetId, action.healAmount);
                break;
            case 'shield':
                enemyShieldSelf(action.targetId, action.shieldAmount);
                break;
            case 'switch':
                if (action.newActiveCardId) {
                    setActiveEnemyId(action.newActiveCardId);
                }
                break;
        }
    }

    const enemyHealSelf = (id: number | null, healValue: number) => {
        if (id == null) return;
        setCards(prev => prev.map(c => {
            if (c.id === id) {
                const maxHealth = c.maxHealth || c.health;
                const newHealth = Math.min(c.health + healValue, maxHealth);
                return { ...c, health: newHealth };
            }
            return c;
        }));
    }

    const enemyShieldSelf = (id: number | null, shieldValue: number) => {
        if (id == null) return;
        setCards(prev => prev.map(c => {
            if (c.id === id) {
                return { ...c, shield: c.shield + shieldValue };
            }
            return c;
        }));
    }

    const applyDmg = (c: { id: any; shield: number; health: number }, id: number, dmg: number) => {
        if(c.id !== id) return c;
        let shield = c.shield ?? 0;
        let health = c.health ?? 0;

        const shieldDmg = Math.min(shield, dmg);
        shield -= shieldDmg;

        const remaining = dmg - shieldDmg;
        health = Math.max(0, health - remaining)

        if(health === 0 && c.health > 0){
            setDeadCards(prev => [...prev, c.id])
        }

        return{...c, shield, health}
    }

    const applyDmgToPlayer = (c: any, id: number, dmg: number) => {
        if(c.id !== id) return c;
        let shield = c.shield ?? 0;
        let health = c.health ?? 0;

        const shieldDmg = Math.min(shield, dmg);
        shield -= shieldDmg;

        const remaining = dmg - shieldDmg;
        health = Math.max(0, health - remaining)

        return{...c, shield, health, isAlive: health > 0}
    }

    const handleDiceClick = (index: number) => {
        if (currentTurn !== 'player') {
            return;
        }

        const diceSel = pendingCard !== null || selectedSup !== null || showAttackMenu || showAllSupport

        if(!showAttackMenu && !showAllSupport && !pendingCard){
            alert("Click on your active card to show menu of attacks")
        }

        if(!diceSel) return

        if(diceSel){
            setSelectedDiceIndex(prev =>
                prev.includes(index)
                    ? prev.filter(i => i !== index)
                    : [...prev, index]
            );
        }
    }

    const diceIndexDel = (arr: DiceSymbol[], indexes: number[]) => { 
        if(indexes === null) return arr; 
        return arr.filter((_, i) => !indexes.includes(i)) 
    }

    const isActiveCardDead = (): boolean => {
        if (activeCard === null) return false;
        const activeCard_obj = characterList.find(c => c.id === activeCard);
        return activeCard_obj ? activeCard_obj.health! <= 0 : false;
    }

    return(
        <div className={style.playPageBody}>
                <div className={style.deckBox}>
                    <img className={style.img} src={cardBack90} alt="cardBack" />
                    <img className={style.img} src={cardBack90} alt="cardBack" />
                </div>
                {enemyDice.length > 0 && (
                    <div className={style.enemyDiceBox}>
                        <div>Enemy Dice: {enemyDice.length}</div>
                        {enemyEndedRound && (
                            <div className={style.enemyEndRoundBanner}>Enemy ended round</div>
                        )}
                    </div>
                )}
                {!firstTurn && (
                    <div className={style.turnIndicator}>
                        <div>Current turn: {currentTurn === 'player' ? 'Player' : 'Enemy'}</div>
                        {playerEndedRound && (
                            <div className={style.playerEndRoundBanner}>You ended round</div>
                        )}
                        {playerEndedRound && enemyEndedRound && isActiveCardDead() && (
                            <div className={style.startingNewRoundBanner}>Choose a new active card to continue</div>
                        )}
                        {playerEndedRound && enemyEndedRound && !isActiveCardDead() && (
                            <div className={style.startingNewRoundBanner}>Starting new round...</div>
                        )}
                    </div>
                )}
                <button className={style.endRoundButton} onClick={() => {
                    if (!firstTurn && !playerEndedRound) {
                        handlePlayerEndRound();
                        setShowAttackMenu(false);
                        setAttackMenu(null);
                    }
                }} disabled={playerEndedRound || isActiveCardDead()}>
                    {playerEndedRound ? 'WAITING...' : 'END ROUND'}
                </button>
                {!firstTurn && pendingCard && !playerEndedRound && !pendingSupportEffect && (
                    <button className={style.confirmButton} 
                    onClick={async () => {
                        const deadActiveCard = activeCard !== null && characterList.find(c => c.id === activeCard)?.health! <= 0;
                        if(!deadActiveCard && selectedDiceIndex.length === 0) { 
                            alert("Choose dice to switch!");
                            return;
                        }  
                        if(!deadActiveCard){
                            const newDice = diceIndexDel(diceSymbols, selectedDiceIndex);
                            diceSymbols.length = 0; 
                            for(let i = 0; i < newDice.length; i++) {
                                diceSymbols.push(newDice[i]);
                            }
                        }

                        setSelectedDiceIndex([])
                        setActiveCard(pendingCard); 
                        setAttackMenu(pendingCard)
                        setPendingCard(null);

                        if (playerEndedRound && enemyEndedRound) {
                            setTimeout(() => startNewRound(), 500);
                        } else if (!deadActiveCard && !enemyEndedRound) {
                            setTimeout(() => {
                                setCurrentTurn('enemy');
                                setGameStatus('enemyTurn');
                            }, 500);
                        }
                        }}>CONFIRM</button>
                )}
                <div className={style.playPanel}>
                    <Hand cards={cards} activeCharacterId={activeEnemyId} selectedCardId={targetId} onCharacterActive={handleTargetSelect} mode='target'/>
                    <Hand cards={characterList} activeCharacterId={activeCard} selectedCardId={pendingCard} onCharacterActive={handleCharacterSelect} mode='active'/>
                    {showAttackMenu && activeCard != null && !firstTurn && (
                        <div className={style.attackMenu}>
                            {(() => {
                                const char = characterList.find(c => c.id === attackMenu);
                                if (!char) return null;
                                return(
                                <>
                                <div className={style.moveRowNormal} onClick={() => handleAttackMove(char.skill1Damage!, char.skill1Cost!)}>
                                    <div className={style.iconBlock}>
                                        <div className={style.swordBlock}>
                                            <img className={style.swordIcon} src={dmg} alt="damage"></img>
                                            <span className={style.damageValue}>{char.skill1Damage}</span>
                                        </div>
                                        <div className={style.priceBlock}>
                                            <img className={style.costIcon} src={cost} alt='cost'></img>
                                            <span className={style.costValue}>{char.skill1Cost}</span>
                                        </div>
                                    </div>
                                    <div className={style.descriptionBlock}>
                                    {char.skill1Name}
                                    </div>
                                </div>
                                <div className={style.moveRowUltimate} onClick={() => handleAttackMove(char.skill2Damage!, char.skill2Cost!, char.skill2Effect)}>
                                    <div className={style.iconBlock}>
                                        <div className={style.swordBlock}>
                                            <img className={style.swordIcon} src={dmg} alt="damage"></img>
                                            <span className={style.damageValue}>{char.skill2Damage}</span>
                                        </div>
                                        <div className={style.priceBlock}>
                                            <img className={style.costIcon} src={cost} alt='cost'></img>
                                            <span className={style.costValue}
                                            style={{
                                            color:
                                                char.skill2Effect?.toLowerCase() === "attack"
                                                ? "#AF0000"
                                                : char.skill2Effect?.toLowerCase() === "shield"
                                                ? "#020BA6"
                                                : char.skill2Effect?.toLowerCase() === "heal"
                                                ? "#007616"
                                                : char.skill2Effect?.toLowerCase() === "mage"
                                                ? "#48047C"
                                                : char.skill2Effect?.toLowerCase() === "rogue"
                                                ? "#B97E00"
                                                : "#F5F5F5",
                                                WebkitTextStroke: "0.5px black",
                                            }}
                                            >{char.skill2Cost}</span>
                                        </div>
                                    </div>
                                    <div className={style.descriptionBlock}>
                                    {char.skill2Name}
                                    </div>
                                </div>
                                </>
                                )
                            })()}
                        </div>
                    )}
                </div>
                <div className={styles}>
                    {!showAllSupport &&(
                        <div onClick={handleSupportClick}>
                            <Hand cards={supportHand.slice(0, 2)} 
                            activeCharacterId={selectedSup} onCharacterActive={() => {}} />
                        </div>
                    )}
                    {showAllSupport &&(
                        <>
                            <Hand
                                cards={supportHand.map((card, idx) => ({
                                    ...card,
                                    id: idx
                                }))}
                                activeCharacterId={null}
                                selectedCardId={selectedSup}
                                onCharacterActive={(_, index) => setSelectedSup(prev => prev === index ? null : index)}
                            />
                            <div className={style.supportButtons}>
                                <button className={style.supportButton} onClick={handleSupportClose}>CANCEL</button>
                                <button className={style.supportButton} onClick={playSupport}>PLAY</button>
                            </div>
                        </>
                    )}
                </div>
                <div className={style.dicePanel}>
                    {diceSymbols
                    .map((symbol, index) => (
                        <Dice key={index} symbol={symbol} isSelected={selectedDiceIndex.includes(index)} 
                        onClick={() => handleDiceClick(index)} />
                    ))}
                </div>
                {gameStatus === 'gameOver' &&(
                    <div className={style.endScreen}>
                        <div className={style.endScreenBoard}>
                            <h3>{gameResult === 'win' ? 'Victory' : 'Defeat'}</h3>
                            <div className={style.endButtons}>
                                <button className={style.button} onClick={() => {
                                        clearSavedGame();
                                        window.location.reload()
                                    }}>
                                    {gameResult === 'win' ? 'Play Again' : 'Try Again'}
                                </button>
                                <Link className={style.button} to="/">BACK</Link>
                            </div>
                        </div>
                    </div>
                )}
        </div>
    )
}
export default PlayPage;