import { useState } from 'react'
import { type FC } from "react"
import style from '../styles/PlayPage.module.css'
import cardBack90 from '../assets/cardback-90.png'
import Hand from "../components/Hand"
import cat from "../assets/blehcat.png"
import type { CardType } from '../types'

type PlayPageProps = {
    
}

const characters = [
    { id: 1, name: "Bleh Cat", type: "character" as CardType, imgSrc: cat, health: 10, shield: 10 },
    { id: 2, name: "Bleh Cat", type: "character" as CardType, imgSrc: cat, health: 10, shield: 10 },
    { id: 3, name: "Bleh Cat", type: "character" as CardType, imgSrc: cat, health: 10, shield: 10 }
];

export const PlayPage: FC<PlayPageProps> = () => {
    const [activeCard, setActiveCard] = useState<number | null>(null)

    const handleCharacterSelect = (cardId: number) => {
        setActiveCard(cardId)
    }

    return(
        <div className={style.playPageBody}>
            <div className={style.deckBox}>
                <img src={cardBack90} alt="cardBack" />
                <img src={cardBack90} alt="cardBack" />
            </div>
            <button className={style.endRoundButton}>END ROUND</button>
            <div className={style.playPanel}>
                <Hand cards={characters} activeCharacterId={activeCard} onCharacterActive={handleCharacterSelect}/>
                <Hand cards={characters} activeCharacterId={activeCard} onCharacterActive={handleCharacterSelect} />
            </div>
            <div className={style.dicePanel}></div>
        </div>
    )
}
export default PlayPage;