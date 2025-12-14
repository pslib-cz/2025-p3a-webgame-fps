import { useState, type FC } from "react";
import style from './Dice.module.css'
import { type DiceSymbol } from "../types";

type DiceProps = {
    symbol: DiceSymbol
}

const Dice: FC<DiceProps> = ({symbol}) => {
    const getSymbolIcon = (s: DiceSymbol) => {
        switch (s) {
            case 'Knight': return '../assets/sword.png';
            case 'Tank': return '../assets/shield.png';
            case 'Mage': return '../assets/mage.png';
            case 'Healer': return '../assets/heal.png';
            case 'Rogue': return '../assets/rogue.png';
            case 'Jester': return '../assets/jester.png';
            default: return '';
        }
    }
    return(
        <div>

        </div>
    );
}
export default Dice;