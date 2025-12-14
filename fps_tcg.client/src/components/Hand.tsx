import Card, { type CardProps } from "./Card";
import {type FC} from "react";
import style from './Hand.module.css'

type HandCard = Pick<CardProps, 'id' | 'name' | 'imgSrc' | 'type' | 'supportCost' | 'supportEffect'>;

type HandProps = {
    cards: HandCard[];
    onCharacterActive: (cardId: number) => void;
    activeCharacterId: number | null;
}

const Hand: FC<HandProps> = ({
    cards,
    activeCharacterId,
    onCharacterActive
    }) => {
    return(
        <div className={style.handContainer}>
            {cards.map(card => (
                <Card
                    key={card.id}
                    {...card}
                    isSelected={card.id === activeCharacterId}
                    onClick={() => onCharacterActive(card.id)}
                />
            ))}

        </div>
    );
}
export default Hand;