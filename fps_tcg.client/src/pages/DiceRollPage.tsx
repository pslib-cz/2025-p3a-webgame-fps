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

    const hasSelected = selected.some(Boolean);

    const handleConfirm = () => {
        const newSymbols = diceSymbols.map((sym, i) => selected[i] ? getRandomSymbol() : sym);
        setDiceSymbols(newSymbols);
        let changed = false; 
        for (let i = 0; i < selected.length; i++) {
             if (selected[i]) { 
                changed = true; 
                break; 
            } 
        }
        if (changed) {
            onSymbolsRolled?.(newSymbols);
            setTimeout(() => {
                onRollConfirmed();
            }, 800)
        } else onRollConfirmed();
        setSelected(new Array(8).fill(false));
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
                    {hasSelected ? 'REROLL' : 'CONFIRM'}
                </button>
            </div>
        </div>   
    )
}
export default DicePage;