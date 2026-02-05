import DicePage from "./DiceRollPage";
import PlayPage from "./PlayPage";
import { useState, type FC } from 'react';
import { type GameView, type DiceSymbol, type GameStatus, type Turn, type GameResult } from "../types";
import type { CardProps } from "../components/Card";

type GameProps = {
    view: GameView;
}

const Game: FC<GameProps> = () =>{
    const [currentView, setCurrentView] = useState<GameView>('Play');
    const [rolledDice, setRolledDice] = useState<DiceSymbol[]>([]);
    const [firstTurn, setFirstTurn] = useState(true);
    const [activeCard, setActiveCard] = useState<number | null>(null)
    const [deadCards, setDeadCards] = useState<number[]>([])
    const [cards, setCards] = useState<any[]>([]);
    const [supportHand, setSupportHand] = useState<CardProps[]>([]);
    const [characterList, setCharacterList] = useState<CardProps[]>([]);
    const [firstDraw, setFirstDraw] = useState(false);
    const [currentTurn, setCurrentTurn] = useState<Turn>('player');
    const [gameStatus, setGameStatus] = useState<GameStatus>('playerTurn');
    const [gameResult, setGameResult] = useState<GameResult>("playing");
    const [activeEnemyId, setActiveEnemyId] = useState<number | null>(null);

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
            firstTurn={firstTurn} setFirstTurn={setFirstTurn} activeCard={activeCard} setActiveCard={setActiveCard} 
            deadCards={deadCards} setDeadCards={setDeadCards} cards={cards} setCards={setCards}
            supportHand={supportHand} setSupportHand={setSupportHand} characterList={characterList} setCharacterList={setCharacterList}
            firstDraw={firstDraw} setFirstDraw={setFirstDraw}
            currentTurn={currentTurn} setCurrentTurn={setCurrentTurn} gameStatus={gameStatus} setGameStatus={setGameStatus}
            gameResult={gameResult} setGameResult={setGameResult} activeEnemyId={activeEnemyId} setActiveEnemyId={setActiveEnemyId}
            />; 
    }
}
export default Game;