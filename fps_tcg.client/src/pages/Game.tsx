import DicePage from "./DiceRollPage";
import PlayPage from "./PlayPage";
import { useState, type FC } from 'react';
import { type GameView, type DiceSymbol } from "../types";

type GameProps = {
    view: GameView;
}

const Game: FC<GameProps> = () =>{
    const [currentView, setCurrentView] = useState<GameView>('Play');
    const [rolledDice, setRolledDice] = useState<DiceSymbol[]>([]);
    const [firstTurn, setFirstTurn] = useState(true);
    const [activeCard, setActiveCard] = useState<number | null>(null)

    const startDiceRoll = () => {
        setCurrentView('Dice_Roll');
    };
    const finishDiceRoll = () => {
        setCurrentView('Play');
    };
    switch (currentView) {
        case 'Dice_Roll':
            return <DicePage onRollConfirmed={finishDiceRoll} onSymbolsRolled={setRolledDice} />;
        case 'Play':
        default:
            return <PlayPage onCardPicked={startDiceRoll} diceSymbols={rolledDice} 
            firstTurn={firstTurn} setFirstTurn={setFirstTurn} activeCard={activeCard} setActiveCard={setActiveCard}/>; 
    }
}
export default Game;