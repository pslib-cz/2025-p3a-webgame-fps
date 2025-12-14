import { type CardType } from "../types";
import { type FC } from "react";
import style from '../components/Card.module.css'
import imgHeart from '../assets/heart.png'
import imgShild from '../assets/shild.png'

export type CardProps = {
    id: number,
    name: string,
    type: CardType,
    imgSrc: string,

    health?: number,
    shield?: number,
    skill1Name?: string,
    skill1Damage?: number,
    skill1Cost?: { [key: string]: number },
    skill2Name?: string,
    skill2Effect?: string,
    skill2Cost?: { [key: string]: number },

    supportCost?: { [key: string]: number },
    supportEffect?: string,

    isSelected?: boolean,
    onClick?: () => void
}

const Card: FC<CardProps> = (props) =>{
    if(props.type === 'character'){
        return(
            <div className={`${style.card} ${style.characterCard} ${props.isSelected ? style.activeCard : ''}`} onClick={props.onClick}>
                <img className={style.img} src={props.imgSrc} alt="Cat" />
                <p className={style.cardName}>{props.name}</p>
                <div className={style.cardStats}>
                    <p className={style.health}><img src={imgHeart} alt="heart"></img>{props.health}</p>
                    <p className={style.shield}><img src={imgShild} alt="shield"></img>{props.shield}</p>
                </div>
            </div>
        )
    }
    if(props.type === 'support'){

        return(
            <div className={`${style.card} ${style.supportCard}`}>
                <p className={style.costTag}></p>
                <img className={style.img} src={props.imgSrc} alt="support" />
                <p className={style.cardName}>{props.name}</p>
                <p className={style.cardEffect}>{props.supportEffect}</p>
            </div>
        )
    }
    return(
        <div className={`${style.card} ${style.errorCard}`}>
            <p>ERROR: Unknown Card Type!</p>
        </div>
    )
}
export default Card;