import {type FC } from 'react';
import { useState } from 'react';
import Dice from '../components/Dice'
import style from '../styles/DiceRollPage.module.css'

type DicePageProps = {
    
}

const DicePage: FC<DicePageProps> = () => {
    return(   
        <div className={style.dicePageBody}>
            <div className={style.selectionContainer}>
                <div className={style.diceContainer}>
                    
                </div>
                <button className={style.confirmButton}>
                    CONFIRM
                </button>
            </div>
        </div>   
    )
}
export default DicePage;