import { StrictMode, useEffect, useRef, useState, type ChangeEvent } from 'react';
import HomePage from './pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router';
import Game from './pages/Game';
import DeckPage from './pages/DeckPage';
import TutorialPage from './pages/TutorialPage';
import DeckXPage from './pages/DeckXPage';
import musicSrc from './musika/MP3_01 In a distant land (Title Screen).mp3';

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  useEffect(() => {
    const tryPlay = () => {
      const audio = audioRef.current;
      if (!audio) {
        return;
      }
      audio.volume = volume;
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.volume = volume;
  }, [volume]);

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

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(event.target.value));
  };

  const handleToggleControls = () => {
    setIsControlsOpen((prev) => !prev);
  };

  return (
    <StrictMode>
      <audio ref={audioRef} src={musicSrc} loop preload="auto" />
      <div className="music-controls">
        <button
          className="music-trigger"
          onClick={handleToggleControls}
          type="button"
          aria-expanded={isControlsOpen}
          aria-controls="music-panel"
        >
          {isControlsOpen ? '×' : '+'}
        </button>
        {isControlsOpen && (
          <div className="music-panel" id="music-panel">
            <button className="music-toggle" onClick={handleToggleMusic} type="button">
              {isPlaying ? 'Music: On' : 'Music: Off'}
            </button>
            <input
              className="music-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Music volume"
            />
          </div>
        )}
      </div>
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
