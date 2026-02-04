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
    skill1Cost?:  number,
    skill2Name?: string,
    skill2Damage?: number,
    skill2Effect?: string,
    skill2Cost?: number ,

    supportCost?:  number,
    supportEffect?: string,

    isActive?: boolean,
    isTarget?: boolean,

    isSelected?: boolean,
    onClick?: () => void
}

const Card: FC<CardProps> = (props) =>{
    const cardActive = [
        props.isActive && style.activeCard,
        props.isTarget && style.targetActiveCard
    ].filter(Boolean).join(" ");

    if(props.type === 'attack'){
        if(props.health !== 0){
            return(
                <div className={`${style.card} ${style.characterCard} ${cardActive}`} 
                onClick={props.onClick}>
                    <img className={style.img} src={props.imgSrc} alt="Cat" />
                    <p className={style.cardName}>{props.name}</p>
                    <div className={style.cardStats}>
                        <p className={style.health}><img src={imgHeart} alt="heart"></img>{props.health}</p>
                        <p className={style.shield}><img src={imgShild} alt="shield"></img>{props.shield}</p>
                    </div>
                </div>
            )
        }
        if(props.health === 0){
            return(
                <div className={`${style.deadCard} ${style.characterCard} ${props.isSelected ? undefined : ''}`} onClick={props.onClick}>
                    <img className={style.img} src={props.imgSrc} alt="Cat" />
                    <p className={style.cardName}>{props.name}</p>
                    <div className={style.cardStats}>
                        <p className={style.health}><img src={imgHeart} alt="heart"></img>{props.health}</p>
                        <p className={style.shield}><img src={imgShild} alt="shield"></img>{props.shield}</p>
                    </div>
                </div>
            )
        }
    }
    
    if(props.type === 'support'){
        return(
            <div className={`${style.card} ${style.supportCard} ${props.isSelected}`} 
            onClick={props.onClick}>
                <p className={style.costTag}>{props.supportCost}</p>
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