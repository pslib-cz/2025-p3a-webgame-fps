import { type FC } from "react";
import style from './Dice.module.css'
import { type DiceSymbol } from "../types";
import sword from '../assets/sword.png';
import shield from '../assets/shield.png';
import mageImg from '../assets/mage.png';
import heal from '../assets/heal.png';
import rogue from '../assets/rogue.png';
import jester from '../assets/jester.png';

type DiceProps = {
    symbol: DiceSymbol;
    isSelected: boolean;
    onClick: () => void;
}

const Dice: FC<DiceProps> = ({symbol, isSelected, onClick}) => {
    const getSymbolIcon = (s: DiceSymbol) => {
        switch (s) {
            case 'Knight': return sword;
            case 'Tank': return shield;
            case 'Mage': return mageImg;
            case 'Healer': return heal;
            case 'Rogue': return rogue;
            case 'Jester': return jester;
            default: return '';
        }
    }
    return(
        <div className={`${style.diceContainer} ${isSelected ? style.selected : ''}`} onClick={onClick}>
            <div className={style.face}  data-symbol={symbol}>
                <img src={getSymbolIcon(symbol)} alt={symbol} />
            </div>
        </div>
    );
}
export default Dice;