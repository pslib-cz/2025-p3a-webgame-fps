import {type FC, useState, useEffect } from 'react';
import Dice from '../components/Dice'
import style from '../styles/DiceRollPage.module.css'
import type { DiceSymbol } from '../types';

const symbols: DiceSymbol[] = ['Knight', 'Tank', 'Mage', 'Healer', 'Rogue', 'Jester'];

const getRandomSymbol = (): DiceSymbol => symbols[Math.floor(Math.random() * symbols.length)];

type DicePageProps = {
    onRollConfirmed: () => void;    
    onSymbolsRolled?: (symbols: DiceSymbol[]) => void;
}

const DicePage: FC<DicePageProps> = ({ onRollConfirmed, onSymbolsRolled }) => {
    const [diceSymbols, setDiceSymbols] = useState<DiceSymbol[]>([]);
    const [selected, setSelected] = useState<boolean[]>(new Array(8).fill(false));

    useEffect(() => {
        const initialDice = Array.from({length: 8}, getRandomSymbol);
        setDiceSymbols(initialDice);
        if (onSymbolsRolled) onSymbolsRolled(initialDice);
    }, []);

    const toggleSelected = (index: number) => {
        setSelected(prev => prev.map((sel, i) => i === index ? !sel : sel));
    };

    const handleConfirm = () => {
        const newSymbols = diceSymbols.map((sym, i) => selected[i] ? getRandomSymbol() : sym);
        setDiceSymbols(newSymbols);
        if (onSymbolsRolled) onSymbolsRolled(newSymbols);
        setSelected(new Array(8).fill(false));
        onRollConfirmed();
    };

    return(   
        <div className={style.dicePageBody}>
            <div className={style.selectionContainer}>
                <div className={style.diceContainer}>
                    {diceSymbols.map((symbol, index) => (
                        <Dice key={index} symbol={symbol} isSelected={selected[index]} onClick={() => toggleSelected(index)}/>
                    ))}
                </div>
                <button className={style.confirmButton} onClick={handleConfirm}>
                    CONFIRM
                </button>
            </div>
        </div>   
    )
}
export default DicePage;