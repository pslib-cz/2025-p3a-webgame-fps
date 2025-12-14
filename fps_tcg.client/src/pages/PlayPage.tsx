import { type FC } from "react"
import style from '../styles/PlayPage.module.css'
import cardBack90 from '../assets/cardback-90.png'
import Card from "../components/Card"
import cat from "../assets/blehcat.png"

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
                <Card id={1} name={"bleh cat"} type={"character"} imgSrc={cat} health={10} shield={10}/>
                <Card id={1} name={"bleh cat"} type={"character"} imgSrc={cat} health={10} shield={10}/>
                <Card id={1} name={"bleh cat"} type={"character"} imgSrc={cat} health={10} shield={10}/>
                <Card id={1} name={"bleh cat"} type={"character"} imgSrc={cat} health={10} shield={10}/>
                <Card id={1} name={"bleh cat"} type={"character"} imgSrc={cat} health={10} shield={10}/>
                <Card id={1} name={"bleh cat"} type={"character"} imgSrc={cat} health={10} shield={10}/>
            </div>
            <div className={style.dicePanel}></div>
        </div>
    )
}
export default PlayPage;