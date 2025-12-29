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
import Deck1Page from './pages/Deck1Page';
import Deck2Page from './pages/Deck2Page';
import Deck3Page from './pages/Deck3Page';

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
          <Route path='/decksEdit/:deckId' element={<DeckEditPage />}/>
          <Route path='/decksEdit/Deck1' element={<Deck1Page />}/>
          <Route path='/decksEdit/Deck2' element={<Deck2Page />}/>
          <Route path='/decksEdit/Deck3' element={<Deck3Page />}/>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}

export default App
