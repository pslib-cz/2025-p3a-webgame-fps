import { useState, useEffect } from 'react'
import { type FC } from "react"
import style from '../styles/PlayPage.module.css'
import cardBack90 from '../assets/cardback-90.png'
import Hand from "../components/Hand"
import cat from "../assets/blehcat.png"
import type { CardType, DiceSymbol } from '../types'
import Dice from '../components/Dice'
import lamma from '../assets/coollama.png'
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
}

const characters = [
    { id: 1, name: "Bleh Cat", type: "attack" as CardType, imgSrc: cat, health: 10, shield: 10, 
        skill1Name: "scratch", skill1Damage: 1, skill1Cost: 1, 
        skill2Name: "Ultimate bleh", skill2Damage: 5, skill2Cost: 3, skill2Effect: 'Knight' },
    { id: 2, name: "Bleh Cat", type: "attack" as CardType, imgSrc: cat, health: 10, shield: 10, 
        skill1Name: "scratch", skill1Damage: 2, skill1Cost: 1, 
        skill2Name: "Ultimate bleh", skill2Damage: 5, skill2Cost: 3, skill2Effect: 'Magic' },
    { id: 3, name: "Bleh Cat", type: "attack" as CardType, imgSrc: cat, health: 10, shield: 10, 
        skill1Name: "scratch", skill1Damage: 1, skill1Cost: 1, 
        skill2Name: "Ultimate bleh", skill2Damage: 4, skill2Cost: 2, skill2Effect: 'Tank' }
];

const mySupport = [
    { id: 10, name: "Cool Lamma 1", type: "support" as CardType, imgSrc: lamma, supportCost: 3, supportEffect: "Your enemy stop 1 turn"},
    { id: 11, name: "Cool Lamma 2", type: "support" as CardType, imgSrc: lamma, supportCost: 3, supportEffect: "Your enemy stop 1 turn"},
    { id: 12, name: "Cool Lamma 3", type: "support" as CardType, imgSrc: lamma, supportCost: 3, supportEffect: "Your enemy stop 1 turn"},
    { id: 13, name: "Cool Lamma 4", type: "support" as CardType, imgSrc: lamma, supportCost: 3, supportEffect: "Your enemy stop 1 turn"},
    { id: 14, name: "Cool Lamma 5", type: "support" as CardType, imgSrc: lamma, supportCost: 3, supportEffect: "Your enemy stop 1 turn"},
    { id: 15, name: "Cool Lamma 6", type: "support" as CardType, imgSrc: lamma, supportCost: 3, supportEffect: "Your enemy stop 1 turn"}
];

export const PlayPage: FC<PlayPageProps> = (
    { onCardPicked, diceSymbols, firstTurn, setFirstTurn, activeCard, setActiveCard, deadCards, setDeadCards}) => {
    const [showAllSupport, setShowAllSupport] = useState(false);
    const [cards, setCards] = useState<any[]>([]);
    const [styles, setStyles] = useState(style.supportCards)
    const [selectedSup, setSelectedSup] = useState<number | null>(null)
    const [attackMenu, setAttackMenu] = useState<number | null>(null)
    const [showAttackMenu, setShowAttackMenu] = useState(false)
    const [pendingCard, setPendingCard] = useState<number | null>(null)
    const [selectedDiceIndex, setSelectedDiceIndex] = useState<number[]>([])
    const [characterList, setCharacterList] = useState<CardProps[]>([]);
    const [targetId, setTargetId] = useState<number | null>(null);
    const [mySupportDeck, setMySupportDeck] = useState<CardProps[]>([]);
    const [mySupportHand, setMySupportHand] = useState<any[]>([])
    const [loadedDeck, setLoadedDeck] = useState(false)

    useEffect(() => {
        const fetchCards = async () => {
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
        console.log('Cards updated:', cards);
    }, [cards]);

    useEffect(() => {
        const fetchDeck = async () => {
            try{
                const response = await fetch(`https://localhost:7077/api/Decks/${localStorage.getItem('activeDeck')}/with-cards`)
                if(!response.ok){
                    throw new Error('Failed to fetch deck')
                }
                const data = await response.json();
                console.log('Raw API response:', data);
                const cardsArray = Array.isArray(data) ? data : (data.cards || []);
                const normalizedDeck = cardsArray.map((card: { cardId: any }) => ({
                    ...card,
                    id: card.cardId,
                    isAlive: !deadCards.includes(card.cardId)
                }));

                const char = normalizedDeck.filter((card: { type: string }) => card.type !== 'support');
                const supportCards = normalizedDeck.filter((card: { type: string }) => card.type === 'support');

                setCharacterList(char);
                setMySupportDeck(supportCards);
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

        setAttackMenu(cardId); 
        setShowAttackMenu(true);
        setPendingCard(cardId)

        if(cardId == activeCard){
            setPendingCard(null);
            return;
        }

        if(firstTurn){
            setActiveCard(cardId);

            setTimeout(() => {
                setFirstTurn(false)
                onCardPicked();
            }, 800)
        }
        console.log('activeCharacterId:', activeCard); 
        console.log('card.id:', card.id, 'selected:', card.id === activeCard);
        console.log(loadedDeck)
    }
    
    const handleTargetSelect = (cardId: number) => {
        if (cardId === undefined || cardId === null) {
            console.error('No cardId provided to handleTargetSelect');
            return;
        }
        console.log('Selecting target:', cardId);
        console.log('Current cards:', cards);
        const currentCard = cards.find(c => c.id === cardId);
        const wasTarget = currentCard.isTarget === true;
        setCards(prev => prev.map(c => ({
            ...c,
            isTarget: c.id === cardId ? !c.isTarget : false 
        })));
        
        const newTargetId = wasTarget ? null : cardId;
        setTargetId(newTargetId);
    }  
    
    const handleSupportClick = () => {
        setShowAllSupport(true);
        setStyles(style.supportCardsOpen)
    }

    const handleSupportClose = () =>{
        setShowAllSupport(false);
        setStyles(style.supportCards); 
    };

    const playSupport = () => {
        if(selectedSup == null) return;

        const support = mySupportHand.find(c => c.id === selectedSup);
        if(!support) return;

        console.log("Playing support card:", support.name);

        setMySupportHand(prevHand => prevHand.filter(c => c.id !== selectedSup));
        setSelectedSup(null)
        setShowAllSupport(false)
        setStyles(style.supportCards)
    }
    
    const handleAttackMove = (move: string, dmg: number, cost: number, effect?: string) => {
        if(targetId == null){
            alert("Choose target to attack")
            console.log(targetId)
            return;
        }

        // if(effect){
        //     const validDices= ['Knight', 'Tank', 'Mage', 'Healer', 'Rogue'].some(type => type === effect)
        //     console.log("Inside Effect")

        //     const selectedDice = selectedDiceIndex.map(i => diceSymbols[i])
        //     console.log(selectedDice)
        //     const hasInvalid = selectedDice.some(dice => dice !== effect && dice !== 'Jester')
        //     if(hasInvalid){
        //         alert(`This skill required ${effect} or Jester dices`)
        //         return;
        //     }
        // }


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
    }

    const drawSupportCards = (count: number) => {
        setMySupportDeck(prevDeck => {
            const newDeck = [...prevDeck];
            const drawnCards = newDeck.splice(0, Math.min(count, newDeck.length));
      
            setMySupportHand(prevHand => [...prevHand, ...drawnCards]);
      
            return newDeck;
        });
    }

    useEffect(() => {
        if (!loadedDeck) return;

        if(firstTurn){
            drawSupportCards(6)
        }else {
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
                if(firstTurn == false){
                    onCardPicked()
                }
            }}>END ROUND</button>
            {!firstTurn && pendingCard && (
                <button className={style.confirmButton} 
                onClick={() => {
                    if(selectedDiceIndex === null) return alert("Choose dice to switch!");  

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
                        <Hand cards={mySupportHand.slice(0, 2)} 
                        activeCharacterId={selectedSup} onCharacterActive={() => {}} />
                    </div>
                )}
                {showAllSupport &&(
                    <>
                        <Hand cards={mySupportHand} activeCharacterId={selectedSup} onCharacterActive={(id) => setSelectedSup(id)} />
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