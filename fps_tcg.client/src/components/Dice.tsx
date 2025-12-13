import { useEffect, useState, type FC } from "react";
import style from './Dice.module.css'

type DiceProps = {
    
}

const Sides = [
        {id: 1, url: '../assets/sword.png', rotX: 0, rotY: 0},
        {id: 2, url: '../assets/mage.png', rotX: 90, rotY: 0},
        {id: 3, url: '../assets/shield.png', rotX: 0, rotY: -90},
        {id: 4, url: '../assets/heal.png', rotX: 0, rotY: 90},
        {id: 5, url: '../assets/rogue.png', rotX: -90, rotY: 0},
        {id: 6, url: '../assets/jester.png', rotX: 0, rotY: 180}
    ]

const Dice: FC<DiceProps> = () => {

}
export default Dice;