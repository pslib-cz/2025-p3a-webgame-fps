import {type FC, useState, useEffect } from 'react';
import Dice from '../components/Dice'
import style from '../styles/DiceRollPage.module.css'
import type { DiceSymbol } from '../types';

const symbols: DiceSymbol[] = ['Knight', 'Tank', 'Mage', 'Healer', 'Rogue', 'Jester'];

const getRandomSymbol = (): DiceSymbol => symbols[Math.floor(Math.random() * symbols.length)];

type DicePageProps = {
    onRollConfirmed: () => void;
}

const DicePage: FC<DicePageProps> = ({ onRollConfirmed }) => {
    const [diceSymbols, setDiceSymbols] = useState<DiceSymbol[]>([]);

    useEffect(() => {
        const initialDice = Array.from({length: 8}, getRandomSymbol);
        setDiceSymbols(initialDice);
    }, []);

    return(   
        <div className={style.dicePageBody}>
            <div className={style.selectionContainer}>
                <div className={style.diceContainer}>
                    {diceSymbols.map((symbol, index) => (
                        <Dice key={index} symbol={symbol}/>
                    ))}
                </div>
                <button className={style.confirmButton}>
                    CONFIRM
                </button>
            </div>
        </div>   
    )
}
export default DicePage;