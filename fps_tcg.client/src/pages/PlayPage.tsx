import { useState, useEffect, } from 'react'
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

type PlayPageProps = {
    onCardPicked: () => void;
    diceSymbols: DiceSymbol[];
    firstTurn: boolean;
    setFirstTurn: (value: boolean) => void;
    activeCard: number | null;
    setActiveCard: (value: number | null) => void;
}

const characters = [
    { id: 1, name: "Bleh Cat", type: "attack" as CardType, imgSrc: cat, health: 10, shield: 10, 
        skill1Name: "scratch", skill1Damage: 1, skill1Cost: 1, 
        skill2Name: "Ultimate bleh", skill2Damage: 5, skill2Cost: 3 },
    { id: 2, name: "Bleh Cat", type: "attack" as CardType, imgSrc: cat, health: 10, shield: 10, 
        skill1Name: "scratch", skill1Damage: 2, skill1Cost: 1, 
        skill2Name: "Ultimate bleh", skill2Damage: 5, skill2Cost: 3 },
    { id: 3, name: "Bleh Cat", type: "attack" as CardType, imgSrc: cat, health: 10, shield: 10, 
        skill1Name: "scratch", skill1Damage: 1, skill1Cost: 1, 
        skill2Name: "Ultimate bleh", skill2Damage: 4, skill2Cost: 2 }
];

const mySupport = [
    { id: 10, name: "Cool Lamma 1", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"},
    { id: 11, name: "Cool Lamma 2", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"},
    { id: 12, name: "Cool Lamma 3", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"},
    { id: 13, name: "Cool Lamma 4", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"},
    { id: 14, name: "Cool Lamma 5", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"},
    { id: 15, name: "Cool Lamma 6", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"}
];

export const PlayPage: FC<PlayPageProps> = (
    { onCardPicked, diceSymbols, firstTurn, setFirstTurn, activeCard, setActiveCard}) => {
    const [showAllSupport, setShowAllSupport] = useState(false);
    const [cards, setCards] = useState([]);
    const[styles, setStyles] = useState(style.supportCards)
    const [selectedSup, setSelectedSup] = useState<number | null>(null)
    const [attackMenu, setAttackMenu] = useState<number | null>(null)
    const [showAttackMenu, setShowAttackMenu] = useState(false)
    const [pendingCard, setPendingCard] = useState<number | null>(null)

    const handleSupportClick = () => {
        setShowAllSupport(true);
        setStyles(style.supportCardsOpen)
    }

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await fetch('https://localhost:7077/api/Cards');
                if (!response.ok) {
                    throw new Error('Failed to fetch cards');
                }
                const data = await response.json();
                setCards(data);
            } catch (error) {
                console.error('Error fetching cards', error);
            }
        };
        fetchCards();
        console.log({cards});
    }, []);

    const handleCharacterSelect = (cardId: number) => {
        const card = characters.find(c => c.id === cardId);
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
    }

    const handleSupportClose = () =>{
        setShowAllSupport(false);
        setStyles(style.supportCards); 
    };

    const playSupport = () => {
        if(selectedSup == null) return;

        const support = mySupport.find(c => c.id === selectedSup);
        if(!support) return;

        console.log("Playing support card:", support.name);

        setSelectedSup(null)
        setShowAllSupport(false)
        setStyles(style.supportCards)
    }
    
    const handleAttackMove = (move: string, dmg: number) => {
        console.log("Selected attack move:", move)
        console.log("Damage", dmg)
        setShowAttackMenu(false);
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
                console.log(firstTurn)
            }}>END ROUND</button>
            {!firstTurn && pendingCard && (
                <button className={style.confirmButton} onClick={
                    () => {
                        setActiveCard(pendingCard); 
                        setPendingCard(null);
                        setShowAttackMenu(false)
                    }}>CONFIRM</button>
            )}
            <div className={style.playPanel}>
                <Hand cards={cards} activeCharacterId={activeCard} onCharacterActive={handleCharacterSelect} />
                <Hand cards={characters} activeCharacterId={activeCard ?? pendingCard} onCharacterActive={handleCharacterSelect} />
                {showAttackMenu && activeCard && !firstTurn && (
                    <div className={style.attackMenu}>
                        {(() => {
                            const char = characters.find(c => c.id === attackMenu);
                            if (!char) return null;
                            return(
                            <>
                            <div className={style.moveRowNormal} onClick={() => handleAttackMove(char.skill1Name, char.skill1Damage)}>
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
                            <div className={style.moveRowUltimate} onClick={() => handleAttackMove(char.skill2Name, char.skill2Damage)}>
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
                        <Hand cards={showAllSupport ? mySupport : mySupport.slice(0, 2)} 
                        activeCharacterId={selectedSup} onCharacterActive={(id) => setSelectedSup(id)} />
                    </div>
                )}
                {showAllSupport &&(
                    <>
                        <Hand cards={mySupport} activeCharacterId={selectedSup} onCharacterActive={(id) => setSelectedSup(id)} />
                        <div className={style.supportButtons}>
                            <button className={style.supportButton} onClick={handleSupportClose}>CANCEL</button>
                            <button className={style.supportButton} onClick={playSupport}>PLAY</button>
                        </div>
                    </>
                )}
            </div>
            <div className={style.dicePanel}>
                {diceSymbols.map((symbol, index) => (
                    <Dice key={index} symbol={symbol} isSelected={false} onClick={() => {}} />
                ))}
            </div>
        </div>
    )
}
export default PlayPage;