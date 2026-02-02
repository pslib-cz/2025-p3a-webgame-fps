import { useState, useEffect } from 'react'
import { type FC } from "react"
import style from '../styles/PlayPage.module.css'
import cardBack90 from '../assets/cardback-90.png'
import Hand from "../components/Hand"
import type { DiceSymbol } from '../types'
import Dice from '../components/Dice'
import dmg from '../assets/damage.png'
import cost from '../assets/price.png'
import type { CardProps } from "../components/Card";

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
    supportHand: CardProps[]
    setSupportHand: (value: CardProps[] | ((prev: CardProps[]) => CardProps[])) => void;
}

export const PlayPage: FC<PlayPageProps> = (
    { onCardPicked, diceSymbols, firstTurn, setFirstTurn, activeCard, setActiveCard, 
        deadCards, setDeadCards, cards, setCards, supportHand, setSupportHand
    }) => {
    const [showAllSupport, setShowAllSupport] = useState(false);
    const [styles, setStyles] = useState(style.supportCards)
    const [selectedSup, setSelectedSup] = useState<number | null>(null)
    const [attackMenu, setAttackMenu] = useState<number | null>(null)
    const [showAttackMenu, setShowAttackMenu] = useState(false)
    const [pendingCard, setPendingCard] = useState<number | null>(null)
    const [selectedDiceIndex, setSelectedDiceIndex] = useState<number[]>([])
    const [characterList, setCharacterList] = useState<CardProps[]>([]);
    const [targetId, setTargetId] = useState<number | null>(null);
    const [supportDeck, setSupportDeck] = useState<CardProps[]>([]);
    const [loadedDeck, setLoadedDeck] = useState(false)

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
                    console.error('No active deck selected');
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
                const normalizedDeck = cardsArray.map((card: { cardId: any }) => ({
                    ...card,
                    id: card.cardId,
                    isAlive: !deadCards.includes(card.cardId),
                    imgSrc: `https://localhost:7077/api/images/${card.cardId}.png`
                }));

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
            setShowAttackMenu(false);  
            setAttackMenu(null);
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
        if(targetId == null){
            alert("Choose target to attack")
            console.log(targetId)
            return;
        }

        if (effect && selectedDiceIndex.length) {
            const selectedDice = selectedDiceIndex.map(i => diceSymbols[i]);

            const invalid = selectedDice.some(d => 
                (effect.toLowerCase() === "attack" && d !== "Knight" && d !== "Jester") ||
                (effect.toLowerCase() === "shield" && d !== "Tank" && d !== "Jester") ||
                (effect.toLowerCase() === "magic" && d !== "Mage" && d !== "Jester") ||
                (effect.toLowerCase() === "heal" && d !== "Healer" && d !== "Jester") ||
                (effect.toLowerCase() === "stealth" && d !== "Rogue" && d !== "Jester")
            );

            if (invalid) {
                alert("This skill requires specific dice or Jester");
                return;
            }
        }

        if(selectedDiceIndex === null) return alert("Choose dices to attack")

        if(selectedDiceIndex.length === cost){
            const newDice = diceIndexDel(diceSymbols, selectedDiceIndex);
            diceSymbols.length = 0;
            for(let i = 0; i < newDice.length; i++) {
                diceSymbols.push(newDice[i]);
            }
            console.log("Selected attack move:", move)
            console.log("Damage", dmg)
            console.log("Target card:", cards.find(c => c.id === targetId));

            dmgDeal(targetId, dmg);
            setTargetId(null)
            setSelectedDiceIndex([])
            setShowAttackMenu(false);
        }else if(selectedDiceIndex.length > cost){
            alert("Too much dices selected!")
            setSelectedDiceIndex([])
        }else alert("Select more dices!")
        console.log("Effect value:", effect);
    }

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

        setSupportHand(handCopy);
        setSelectedSup(null)
        setShowAllSupport(false)
        setStyles(style.supportCards)
        console.log("Playing support card:", support.name);
    }

    const drawSupportCards = (count: number) => {
        if (supportDeck.length === 0) return;
        const deckCopy = [...supportDeck];
        const drawnCards: CardProps[] = [];
        for (let i = 0; i < count && deckCopy.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * deckCopy.length);
            const card = deckCopy.splice(randomIndex, 1)[0];
            drawnCards.push({...card});
        }
        setSupportHand(prevHand => [...prevHand, ...drawnCards]);
        setSupportDeck(deckCopy);
    }

    useEffect(() => {
        if (!loadedDeck) return;

        if (firstTurn && supportHand.length === 0) {
            drawSupportCards(6);
        }else if(!firstTurn && supportDeck.length > 0){
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

    const handleDiceClick = (index: number) => {
        if(pendingCard) {
            setSelectedDiceIndex([index]);
            return;
        }
        if(targetId) {
            if(selectedDiceIndex.includes(index)) {
                setSelectedDiceIndex(selectedDiceIndex.filter(i => i !== index))
            } else {
                setSelectedDiceIndex([...selectedDiceIndex, index])
            }
        }
        if(selectedSup){
            setSelectedDiceIndex([...selectedDiceIndex, index])
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
                    onCardPicked();
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
                <Hand cards={cards.slice(0,3)} activeCharacterId={targetId} onCharacterActive={handleTargetSelect} />
                <Hand cards={characterList} activeCharacterId={activeCard ?? pendingCard} onCharacterActive={handleCharacterSelect} />
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
                                        <span className={style.costValue}>{char.skill2Cost}</span>
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
                        <Hand cards={supportHand} activeCharacterId={selectedSup} onCharacterActive={(id) => setSelectedSup(prev => (prev === id ? null : id))}/>
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
        </div>
    )
}
export default PlayPage;