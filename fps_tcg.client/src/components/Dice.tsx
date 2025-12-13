import { useEffect, useState, type FC } from "react";
import style from './Dice.module.css'

type DiceProps = {
    diceIndex: number;
    onSelectToggle: (index: number, isSelected: boolean) => void;
    onRollComplete: (resultId: number) => void;
    initialSideId: number | null;
    isHeld: boolean;
}

const Sides = [
        {id: 1, url: '../assets/sword.png', rotX: 0, rotY: 0},
        {id: 2, url: '../assets/mage.png', rotX: 90, rotY: 0},
        {id: 3, url: '../assets/shield.png', rotX: 0, rotY: -90},
        {id: 4, url: '../assets/heal.png', rotX: 0, rotY: 90},
        {id: 5, url: '../assets/rogue.png', rotX: -90, rotY: 0},
        {id: 6, url: '../assets/jester.png', rotX: 0, rotY: 180}
    ]

const Dice: FC<DiceProps> = ({diceIndex, onSelectToggle, onRollComplete, initialSideId, isHeld}) => {
    const targetSide = initialSideId !== null ? Sides.find(side => side.id === initialSideId) : Sides[0];
    const initialRotation = targetSide ? { x: targetSide.rotX, y: targetSide.rotY } : { x: 0, y: 0 };
    const [rotation, setRotation] = useState(initialRotation)
    const [isRolling, setRolling] = useState(false)
    useEffect(() => {
        if (initialSideId === null) {
            rollDice();
        }
    }, []);

    const getSideData = (id: number) => Sides.find(side=> side.id === id);

    const rollDice = () => {
        if (isRolling) return;
        setRolling(true);
        const resultId = Math.floor(Math.random() * 6) + 1;
        const targetSide = getSideData(resultId);
        if (!targetSide) return;
        const fixedSpin = 2;
        const spinX = (fixedSpin * 360) + Math.floor(Math.random() * 360);
        const spinY = (fixedSpin * 360) + Math.floor(Math.random() * 360);
        const newX = spinX + targetSide.rotX;
        const newY = spinY + targetSide.rotY;
        setRotation({ x: newX, y: newY });
        setTimeout(() => {
            setRolling(false);
            onRollComplete(resultId); 
        }, 2000);
    }

    const handleSelectToggle = () => {
        // Only allow selection if the roll is complete (initialSideId is not null)
        if (!isRolling && initialSideId !== null) {
            onSelectToggle(diceIndex, !isHeld);
        }
    }

    return(
        <div className={`${style.diceContainer} ${isHeld ? style.selected : ''}`} onClick={handleSelectToggle}>
            <div className={`${style.diceCube} ${isRolling ? style.rolling : ''}`}>
                <div className={style.face}>
                    <img src={Sides[0].url} alt="Side 1" />
                </div>
                <div className={style.face}>
                    <img src={Sides[1].url} alt="Side 2" />
                </div>
                <div className={style.face}>
                    <img src={Sides[2].url} alt="Side 3" />
                </div>
                <div className={style.face}>
                    <img src={Sides[3].url} alt="Side 4" />
                </div>
                <div className={style.face}>
                    <img src={Sides[4].url}alt="Side 5" />
                </div>
                <div className={style.face}>
                    <img src={Sides[5].url} alt="Side 6" />
                </div>
            </div>
        </div>
    )
}
export default Dice;