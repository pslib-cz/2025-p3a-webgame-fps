import { StrictMode, useEffect, useRef, useState } from 'react';
import HomePage from './pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router';
import Game from './pages/Game';
import PlayPage from './pages/PlayPage';
import DeckPage from './pages/DeckPage';
import TutorialPage from './pages/TutorialPage';
import DeckEditPage from './pages/DeckEditPage';
import DiceRollPage from './pages/DiceRollPage'
import DeckXPage from './pages/DeckXPage';
import musicSrc from './musika/MP3_01 In a distant land (Title Screen).mp3';

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const tryPlay = () => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }
      audio.volume = 0.35;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
        });
    };

    const handleFirstInteraction = () => {
      tryPlay();
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const handleToggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <StrictMode>
      <audio ref={audioRef} src={musicSrc} loop preload="auto" />
      <button className="music-toggle" onClick={handleToggleMusic} type="button">
        {isPlaying ? 'Music: On' : 'Music: Off'}
      </button>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path='/game/*' element={<Game view={'Play'} />}/>
          <Route path='/decksEdit/' element={<DeckPage />}/>
          <Route path='/tutorial' element={<TutorialPage />}/>
          <Route path='/decksEdit/:deckId' element={<DeckXPage />}/>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}

export default App
