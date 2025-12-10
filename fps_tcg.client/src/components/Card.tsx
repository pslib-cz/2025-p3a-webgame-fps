import { type CardType } from "../types";
import { useState, type FC } from "react";

type Attack = {
  name: string;
  damage: number;
  cost: number;
};

type CardProps = {
    cardImg: string,
    name: string,
    hp: number,
    def: number,
    type: CardType;
    attacks: Attack[];
}

const Card: FC<CardProps> = ({cardImg, name, hp: initialHp, def:initialDef, type, attacks}) =>{
    const [hp] = useState<number>(initialHp);
    const [def] = useState<number>(initialDef);

    const [showAtkMenu, setShowAtkMenu] = useState(false);

    const handleClick = () =>{
        setShowAtkMenu((prev) => !prev)
    }

    const handleClickAttack = (atk: Attack)=>{
        setShowAtkMenu(false);
    }

    return(
        <div onClick={handleClick}>
            <img src={cardImg} alt={name} />
            <div>{name}</div>
            <div>{hp}</div>
            <div>{def}</div>
            <div>{type}</div>
        </div>
    )
}
export default Card;