import {type FC } from 'react';
import { useState } from 'react';
import Dice from '../components/Dice'
import style from '../styles/DiceRollPage.module.css'

type DicePageProps = {
    onRollConfirmed: () => void;
}

const DicePage: FC<DicePageProps> = () => {
    const [lastRollResultId, setLastRollResultId] = useState<number | null>(null);
    const handleRoll = (resultId: number) => {
        setLastRollResultId(resultId);
    }
    const diceArray = Array(8).fill(null);
    return(   
        <div className={style.dicePageBody}>
            <div className={style.selectionContainer}>
                <div className={style.diceContainer}>
                    {diceArray.map((_, index) => (
                        <Dice key={index} onRollComplete={handleRoll} diceIndex={0} onSelectToggle={function (index: number, isSelected: boolean): void {
                        } } initialSideId={null} isHeld={false}/>
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