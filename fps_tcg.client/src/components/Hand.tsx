import Card, { type CardProps } from "./Card";
import {type FC} from "react";
import style from './Hand.module.css'

type HandCard = Pick<CardProps, 'id' | 'name' | 'type' | 'supportCost' | 'supportEffect'>;

type HandProps = {
    cards: HandCard[];
    onCardSelect: (cardId: number) => void;
    selectedCardId: number | null;
}

const Hand: FC<HandProps> = ({cards, onCardSelect, selectedCardId}) => {
    return(
        <div className={style.handContainer}>
            {
                cards.map((card) => {
                    const isSelected = card.id === selectedCardId;
                    return(
                        <div
                            key={card.id}
                            onClick={() => onCardSelect(card.id)}
                        >
                            <Card 
                                {...card as CardProps}
                                isSelected={isSelected}
                            />
                        </div>
                    );
                })
            }
        </div>
    );
}
export default Hand;