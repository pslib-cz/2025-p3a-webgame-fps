import { useState, useEffect } from 'react'
import { type FC } from "react"
import style from '../styles/PlayPage.module.css'
import cardBack90 from '../assets/cardback-90.png'
import Hand from "../components/Hand"
import cat from "../assets/blehcat.png"
import type { CardType, DiceSymbol } from '../types'
import Dice from '../components/Dice'
import lamma from '../assets/coollama.png'

type PlayPageProps = {
    onCardPicked: () => void;
    diceSymbols: DiceSymbol[];
}

const characters = [
    { id: 1, name: "Bleh Cat", type: "attack" as CardType, imgSrc: cat, health: 10, shield: 10 },
    { id: 2, name: "Bleh Cat", type: "attack" as CardType, imgSrc: cat, health: 10, shield: 10 },
    { id: 3, name: "Bleh Cat", type: "attack" as CardType, imgSrc: cat, health: 10, shield: 10 }
];

const mySupport = [
    { id: 10, name: "Cool Lamma", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"},
    { id: 11, name: "Cool Lamma", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"},
    { id: 12, name: "Cool Lamma", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"},
    { id: 13, name: "Cool Lamma", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"},
    { id: 14, name: "Cool Lamma", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"},
    { id: 15, name: "Cool Lamma", type: "support" as CardType, imgSrc: lamma, supportCost: 7, supportEffect: "Your enemy stop 1 turn"}
];

export const PlayPage: FC<PlayPageProps> = ({ onCardPicked, diceSymbols}) => {
    const [activeCard, setActiveCard] = useState<number | null>(null)
    const [showAllSupport, setShowAllSupport] = useState(false);
    const [cards, setCards] = useState([]);
    const[styles, setStyles] = useState(style.supportCards)
    const [selectedSup, setSelectedSup] = useState<number | null>(null)

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
        setActiveCard(cardId);
        onCardPicked();
    }

    const handleSupportClose = () =>{
        setShowAllSupport(false);
        setStyles(style.supportCards); 
    };

    const playSupport = () => {
        if(selectedSup == null) return;

        const card = mySupport.find(c => c.id === selectedSup);
        if(!card) return;

        console.log("Playing support card:", card.name);

        setSelectedSup(null)
        setShowAllSupport(false)
        setStyles(style.supportCards)
    }

    return(
        <div className={style.playPageBody}>
            <div className={style.deckBox}>
                <img src={cardBack90} alt="cardBack" />
                <img src={cardBack90} alt="cardBack" />
            </div>
            <button className={style.endRoundButton}>END ROUND</button>
            <div className={style.playPanel}>
                <Hand cards={cards} activeCharacterId={activeCard} onCharacterActive={handleCharacterSelect}/>
                <Hand cards={characters} activeCharacterId={activeCard} onCharacterActive={handleCharacterSelect} />
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