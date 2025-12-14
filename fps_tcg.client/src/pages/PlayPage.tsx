import { useState } from 'react'
import { type FC } from "react"
import style from '../styles/PlayPage.module.css'
import cardBack90 from '../assets/cardback-90.png'
import Hand from "../components/Hand"

type PlayPageProps = {
    onCardPicked: () => void;
}

export const PlayPage: FC<PlayPageProps> = () => {
    return(
        <div className={style.playPageBody}>
            <div className={style.deckBox}>
                <img src={cardBack90} alt="cardBack" />
                <img src={cardBack90} alt="cardBack" />
            </div>
            <button className={style.endRoundButton}>END ROUND</button>
            <div className={style.playPanel}>
                <Hand cards={[]} onCardSelect={function (_cardId: number): void {} } selectedCardId={null} />
                <Hand cards={[]} onCardSelect={function (_cardId: number): void {} } selectedCardId={null} />
            </div>
            <div className={style.dicePanel}></div>
        </div>
    )
}
export default PlayPage;