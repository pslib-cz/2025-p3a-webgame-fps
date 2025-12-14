import Card, { type CardProps } from "./Card";
import {type FC} from "react";
import style from './Hand.module.css'
import cat from "../assets/blehcat.png"

type HandCard = Pick<CardProps, 'id' | 'name' | 'type' | 'supportCost' | 'supportEffect'>;

type HandProps = {
    cards: HandCard[];
    onCardSelect: (cardId: number) => void;
    selectedCardId: number | null;
}

const Hand: FC<HandProps> = () => {
    return(
        <div className={style.handContainer}>
            <Card id={1} name={"bleh cat"} type={"character"} imgSrc={cat} health={10} shield={10}/>
            <Card id={1} name={"bleh cat"} type={"character"} imgSrc={cat} health={10} shield={10}/>
            <Card id={1} name={"bleh cat"} type={"character"} imgSrc={cat} health={10} shield={10}/>
        </div>
    );
}
export default Hand;