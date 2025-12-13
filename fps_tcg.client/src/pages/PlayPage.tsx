import { type FC } from "react"
import style from '../styles/PlayPage.module.css'

type PlayPageProps = {
    onCardPicked: () => void;
}

export const PlayPage: FC<PlayPageProps> = () => {
    return(
        <div className={style.playPageBody}>
            <button className={style.endRoundButton}>END ROUND</button>
            <div className={style.dicePanel}></div>
        </div>
    )
}
export default PlayPage;