import DicePage from "./DiceRollPage";
import PlayPage from "./PlayPage";
import { useState, type FC } from 'react';
import { type GameView } from "../types";

type GameProps = {
    view: GameView;
}

const Game: FC<GameProps> = () =>{
    const [currentView, setCurrentView] = useState<GameView>('Play');
    const startDiceRoll = () => {
        setCurrentView('Dice_Roll');
    };
    const finishDiceRoll = () => {
        setCurrentView('Play');
    };
    switch (currentView) {
        case 'Dice_Roll':
            return <DicePage onRollConfirmed={finishDiceRoll} />;
        case 'Play':
        default:
            return <PlayPage onCardPicked={startDiceRoll} />; 
    }
}
export default Game;