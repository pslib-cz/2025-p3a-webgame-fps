import { StrictMode } from 'react';
//import './App.css'
import HomePage from './pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router';
import Game from './pages/Game';
import PlayPage from './pages/PlayPage';
import DeckPage from './pages/DeckPage';
import TutorialPage from './pages/TutorialPage';
import DeckEditPage from './pages/DeckEditPage';
import DiceRollPage from './pages/DiceRollPage'
import DeckXPage from './pages/DeckXPage';

function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path='/game/' element={<Game view={'Play'} />}/>
          <Route path='/game/' element={<PlayPage onCardPicked={() => void {}} diceSymbols={[]} />}/>
          <Route path='/game/diceRoll' element={<DiceRollPage onRollConfirmed={() => void {}} />}/>
          <Route path='/decksEdit/' element={<DeckPage />}/>
          <Route path='/tutorial' element={<TutorialPage />}/>
          <Route path='/decksEdit/:deckId' element={<DeckXPage />}/>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}

export default App
