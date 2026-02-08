import Card, { type CardProps } from "./Card";
import {type FC} from "react";
import style from './Hand.module.css'

type HandCard = Pick<CardProps, 'id' | 'name' | 'imgSrc' | 'type' | 'supportCost' | 'supportEffect'>;

type HandProps = {
    cards: HandCard[];
    onCharacterActive: (cardId: number, index: number) => void;
    activeCharacterId: number | null;
    selectedCardId?: number | null;
    mode?: "active" | "target";
}

const Hand: FC<HandProps> = ({
    cards,
    activeCharacterId,
    selectedCardId = null,
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
                    isPending={
                        (mode === "active" && selectedCardId !== null && card.id === selectedCardId) ||
                        (mode === "target" && selectedCardId !== null && card.id === selectedCardId)
                    }
                    onClick={() => onCharacterActive(card.id, index)}
                />
            ))}
        </div>
    );
}
export default Hand;