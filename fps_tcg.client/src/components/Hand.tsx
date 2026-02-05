import Card, { type CardProps } from "./Card";
import {type FC} from "react";
import style from './Hand.module.css'

type HandCard = Pick<CardProps, 'id' | 'name' | 'imgSrc' | 'type' | 'supportCost' | 'supportEffect'>;

type HandProps = {
    cards: HandCard[];
    onCharacterActive: (cardId: number) => void;
    activeCharacterId: number | null;
    mode?: "active" | "target";
}

const Hand: FC<HandProps> = ({
    cards,
    activeCharacterId,
    onCharacterActive,
    mode = "active"
    }) => {
    return(
        <div className={style.handContainer}>
            {cards.map((card, index) => 
            (
                <Card
                    key={`${card.id}-${index}`}
                    {...card}
                    isActive={mode === "active" && card.id === activeCharacterId}
                    isTarget={mode === "target" && card.id === activeCharacterId}
                    isSelected={card.id === activeCharacterId}
                    onClick={() => onCharacterActive(card.id)}
                />
            ))}
        </div>
    );
}
export default Hand;