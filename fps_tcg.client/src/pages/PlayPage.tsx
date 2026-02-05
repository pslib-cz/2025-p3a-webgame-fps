import { useState, useEffect } from 'react'
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
import { useNavigate } from 'react-router'

type PlayPageProps = {
    onCardPicked: () => void;
    diceSymbols: DiceSymbol[];
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
    { onCardPicked, diceSymbols, firstTurn, setFirstTurn, activeCard, setActiveCard, 
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
    const navigate = useNavigate();

    useEffect(() => {
        if (currentTurn === 'enemy') {
            const executeEnemyTurn = async () => {
                await new Promise(resolve => setTimeout(resolve, 1500));

                const enemyCards: EnemyCard[] = cards.map(c => ({
                    id: c.id,
                    name: c.name || 'Enemy',
                    type: c.type || 'attack',
                    health: c.health,
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
                    console.log('No alive enemies');
                    setCurrentTurn('player');
                    setGameStatus('playerTurn');
                    onCardPicked();
                    return;
                }

                const enemyActiveCard = activeEnemyId ?? aliveEnemies[0].id;
                setActiveEnemyId(enemyActiveCard);
                const ai = new EnemyAI(enemyCards, enemyActiveCard);
                
                if (!activeCard) {
                    console.log('Player has no active card');
                    setCurrentTurn('player');
                    setGameStatus('playerTurn');
                    onCardPicked();
                    return;
                }

                const playerActiveCard = characterList.find(c => c.id === activeCard);
                if (!playerActiveCard || playerActiveCard.health! <= 0) {
                    console.log('Player active card not found or dead');
                    setCurrentTurn('player');
                    setGameStatus('playerTurn');
                    onCardPicked();
                    return;
                }

                const attack = ai.evaluateAttack([playerActiveCard]);

                if (attack) {
                    console.log('Enemy attacks player active card:', attack);
                    enemyDmgToPlayer(attack.targetId, attack.damage);
                }

                await new Promise(resolve => setTimeout(resolve, 1000));

                setCurrentTurn('player');
                setGameStatus('playerTurn');
                onCardPicked();
            };

            executeEnemyTurn();
        }
    }, [currentTurn]);

    useEffect(() => {
        const fetchCards = async () => {
            if (cards.length > 0) return;
            try {
                const response = await fetch('https://localhost:7077/api/Cards');
                if (!response.ok) {
                    throw new Error('Failed to fetch cards');
                }
                const data = await response.json();
                const normalizedCards = data.map((card: { cardId: any, health: any, shield: any }) => ({
                    ...card,
                    id: card.cardId,
                    isTarget: false,
                    isAlive: !deadCards.includes(card.cardId),
                    imgSrc: `https://localhost:7077/api/images/${card.cardId}.png`,
                    health: deadCards.includes(card.cardId) ? 0 : card.health,
                    shield: deadCards.includes(card.cardId) ? 0 : card.shield
                }));
                setCards(normalizedCards);
            } catch (error) {
                console.error('Error fetching cards', error);
            }
        };
        fetchCards();
    }, []);
    
    useEffect(() => {
        const fetchDeck = async () => {
            try{
                const stored = localStorage.getItem('activeDeck');
                if (!stored) {
                    alert('No active deck selected');
                    navigate('/')
                    return;
                }
                const activeDeck = JSON.parse(stored);
                const response = await fetch(`https://localhost:7077/api/Decks/${activeDeck.deckId}/with-cards`)
                if(!response.ok){
                    throw new Error('Failed to fetch deck')
                }
                const data = await response.json();
                console.log('Raw API response:', data);
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
                        isAlive: !deadCards.includes(card.cardId),
                        health,
                        shield,
                        imgSrc: `https://localhost:7077/api/images/${card.cardId}.png`
                    }
                });

                const char = normalizedDeck.filter((card: { type: string }) => card.type !== 'support');
                const supportCards = normalizedDeck.filter((card: { type: string }) => card.type === 'support');

                setCharacterList(char);
                setSupportDeck(supportCards);
                setLoadedDeck(true);
                console.log('Deck loaded successfully!');
            } catch(error){
                console.error('Error fetching deck', error)
            }
        };
        fetchDeck();
    }, []);

    useEffect(() => {
        const aliveEnemies = cards.filter(c => c.isAlive && c.health > 0);
        
        if (aliveEnemies.length === 0) {
            setActiveEnemyId(null);
            return;
        } else {
            if (!activeEnemyId || !aliveEnemies.some(e => e.id === activeEnemyId)) {
                setActiveEnemyId(aliveEnemies[0].id);
            }
        }
    }, [cards, activeEnemyId]);

    useEffect(() => {
        if (gameResult === "playing") return;

        const aliveAllies = characterList.filter(c => c.health! > 0);
        const aliveEnemies = cards.filter(c => c.health! > 0);

        if (!aliveEnemies) {
            const nextEnemy = cards.find(c => c.isAlive && c.health > 0);
            setActiveEnemyId(nextEnemy ? nextEnemy.id : null);
        }

        if (aliveEnemies.length === 0) {
            setGameResult("win");
            console.log(gameResult)
        }else if (aliveAllies.length === 0) {
            setGameResult("lose");
            console.log(gameResult)
        }
    }, [cards, characterList, gameResult]); 

    const handleCharacterSelect = (cardId: number) => {
        const card = characterList.find(c => c.id === cardId);
        if (!card) return;

        if(cardId == activeCard){
            setPendingCard(null);
            setShowAttackMenu(true);
            setAttackMenu(cardId);
            return;
        }

        if(firstTurn){
            setActiveCard(cardId);
            setTimeout(() => {
                setFirstTurn(false)
                onCardPicked();
            }, 800)
        }
        else {
            setPendingCard(cardId);
            if (!showAttackMenu) {
                setShowAttackMenu(false);
                setAttackMenu(null);
            }
        }
    }
    
    const handleTargetSelect = (cardId: number) => {
        if (!cardId) return;

        setCards(prev =>
            prev.map(c => ({
                ...c,
                isTarget: c.id === cardId ? !c.isTarget : false
            }))
        );
        setTargetId(prev => (prev === cardId ? null : cardId));
    }  
    
    const handleSupportClick = () => {
        setShowAllSupport(true);
        setStyles(style.supportCardsOpen)
    }

    const handleSupportClose = () =>{
        setShowAllSupport(false);
        setStyles(style.supportCards); 
    };
    
    const handleAttackMove = (move: string, dmg: number, cost: number, effect?: string) => {
        const effectType = effect?.toLowerCase()
        const enemyTarget = effectType === "attack" || effectType === "magic" || effectType === "stealth";
        const allyTarget = effectType === "shield" || effectType === "heal";

        if (activeEnemyId == null) {
            alert("Choose enemy target");
            return;
        }

        if (allyTarget && activeCard == null) {
            alert("Choose ally");
            return;
        }

        if (effect && selectedDiceIndex.length) {
            const selectedDice = selectedDiceIndex.map(i => diceSymbols[i]);

            const invalid = selectedDice.some(d => 
                (effectType === "attack" && d !== "Knight" && d !== "Jester") ||
                (effectType === "shield" && d !== "Tank" && d !== "Jester") ||
                (effectType === "magic" && d !== "Mage" && d !== "Jester") ||
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
            giveShieldToAlly(pendingCard, dmg);
            break;

        case "heal":
            healAlly(pendingCard, dmg);
            break;

        case "magic":
            dmgDeal(activeEnemyId, dmg); 
            break;

        case "rogue":
            dmgDeal(targetId, dmg)
            break;
        default:
            dmgDeal(activeEnemyId, dmg);
            break;
        }

        if (enemyTarget) {
            setTargetId(null);
        }
        console.log(move)
        console.log(activeEnemyId)
    }

    const giveShieldToAlly = (id: number | null, value: number) => {
        if (id == null) return;
        setCharacterList(prev =>
            prev.map(c =>
                c.id === id ? { ...c, shield: (c.shield ?? 0) + value } : c
            )
        );
    };

    const healAlly = (id: number | null, value: number) => {
        if (id == null) return;
        setCharacterList(prev =>
            prev.map(c =>
                c.id === id ? { ...c, health: c.health! + value } : c
            )
        );
    };

    const playSupport = () => {
        if(selectedSup == null) return;

        const support = supportHand.find(c => c.id === selectedSup);
        if(!support) return;

        if (selectedDiceIndex.length < support.supportCost!) {
            alert(`You need ${support.supportCost} dice to play this support card!`);
            return;
        }

        const newDice = diceIndexDel(diceSymbols, selectedDiceIndex);
        diceSymbols.length = 0;
        for (let i = 0; i < newDice.length; i++) {
            diceSymbols.push(newDice[i]);
        }
        setSelectedDiceIndex([]);

        const handCopy = [...supportHand];
        const cardIndex = handCopy.findIndex(card => card.id === selectedSup);
        if (cardIndex !== -1) {
            handCopy.splice(cardIndex, 1);
        }

        const effectToDice: Record<string, DiceSymbol> = {
            stealth: "Rogue",
            attack: "Knight",
            shield: "Tank",
            magic: "Mage",
            heal: "Healer",
            Jester: 'Jester'
        };

        if (support.supportEffect?.startsWith("give_")) {
            const effectName  = support.supportEffect.split("_")[1];
            const diceToGive = effectToDice[effectName];
            
            diceSymbols.push(diceToGive);
            
            console.log(`Added dice from support: ${diceToGive}`);
        }

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
        setSupportHand(prev => [...prev, ...newCards]);
        setSupportDeck(deckCopy);
    }

    useEffect(() => {
        if (!loadedDeck) return;

        if (firstTurn && !firstDraw) {
            drawSupportCards(6);
            setFirstDraw(true)
        }else if(!firstTurn){
            drawSupportCards(2)
        }
    }, [firstTurn, loadedDeck])

    const dmgDeal = (id: number | null, dmg: number) =>{
        if(id == null) return;
        const isInCards = cards.some(c => c.id === id);
        
        if(isInCards) {
            setCards(prev => prev.map(c => applyDmg(c, id, dmg)));
        }
    }

    const enemyDmgToPlayer = (id: number | null, dmg: number) => {
        if(id == null) return;
        const isInCharacterList = characterList.some(c => c.id === id);
        
        if(isInCharacterList) {
            setCharacterList(prev => prev.map(c => applyDmgToPlayer(c, id, dmg)));
        }
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
            console.log('Card died:', c);
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

        if(health === 0 && c.health > 0){
            console.log('Player card died:', c);
        }

        return{...c, shield, health, isAlive: health > 0}
    }

    const handleDiceClick = (index: number) => {
        const diceSel = pendingCard !== null || selectedSup !== null || showAttackMenu

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

    return(
        <div className={style.playPageBody}>
                <div className={style.deckBox}>
                    <img src={cardBack90} alt="cardBack" />
                    <img src={cardBack90} alt="cardBack" />
                </div>
                <button className={style.endRoundButton} onClick={() => {
                if (!firstTurn) {
                        setCurrentTurn('enemy');
                        setGameStatus('enemyTurn');
                    }
                }}>END ROUND</button>
                {!firstTurn && pendingCard && (
                    <button className={style.confirmButton} 
                    onClick={() => {
                        if(selectedDiceIndex.length === 0) return alert("Choose dice to switch!");  

                            const newDice = diceIndexDel(diceSymbols, selectedDiceIndex);
                            diceSymbols.length = 0; 
                            for(let i = 0; i < newDice.length; i++) {
                                diceSymbols.push(newDice[i]);
                            }

                            setSelectedDiceIndex([])
                            setActiveCard(pendingCard); 
                            setPendingCard(null);
                            setShowAttackMenu(false)
                            console.log('Dice:', selectedDiceIndex, 'was used')
                        }}>CONFIRM</button>
                )}
                <div className={style.playPanel}>
                    <Hand cards={cards.slice(0,3)} activeCharacterId={activeEnemyId} onCharacterActive={handleTargetSelect} mode='target'/>
                    <Hand cards={characterList} activeCharacterId={activeCard ?? pendingCard} onCharacterActive={handleCharacterSelect} mode='active'/>
                    {showAttackMenu && activeCard && !firstTurn && (
                        <div className={style.attackMenu}>
                            {(() => {
                                const char = characterList.find(c => c.id === attackMenu);
                                if (!char) return null;
                                return(
                                <>
                                <div className={style.moveRowNormal} onClick={() => handleAttackMove(char.skill1Name!, char.skill1Damage!, char.skill1Cost!)}>
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
                                <div className={style.moveRowUltimate} onClick={() => handleAttackMove(char.skill2Name!, char.skill2Damage!, char.skill2Cost!, char.skill2Effect)}>
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
                                                : char.skill2Effect?.toLowerCase() === "magic"
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
                            <Hand cards={supportHand} activeCharacterId={selectedSup} 
                            onCharacterActive={(card) => setSelectedSup(prev => (prev === card ? null : card))}/>
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
            {gameResult === "win" && (
                <div className={style.endScreenWin}>
                    <h3>WIN</h3>
                    <button onClick={() => navigate("/")}>Back to Menu</button>
                </div>
            )}
            {gameResult === "lose" && (
                <div className={style.endScreenLose}>
                    <h3>LOSE</h3>
                    <button onClick={() => navigate("/")}>Back to Menu</button>
                </div>
            )}
        </div>
    )
}
export default PlayPage;