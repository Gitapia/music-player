import { useState } from 'react';
import YouTubePlayer from './components/YoutubePlayer';
import Player from './components/Player';
import Playlist from './components/Playlist';
import './App.css';

function App() {
  const [activePlayer] = useState('local'); // 'local' o 'youtube'
  
  // Define your songs array here
  const songs = [
    {
      title: "MASSIEL ROSAS EN EL MAR",
      artist: "Massiel",
      src: "./assets/songs/MASSIEL ROSAS EN EL MAR.mp3"
    },
    {
      title: "Te Conozco",
      artist: "Arjona Ricardo",
      src: "./assets/songs/Te Conozco.mp3"
    }
    // Add more songs as needed
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  return (
    <div className="app">
      <h1>Reproductor de Música</h1>
      <div className="music-container">
        {activePlayer === 'local' ? (
          <>
            <Player
              songs={songs}
              currentSongIndex={currentSongIndex}
              setCurrentSongIndex={setCurrentSongIndex}
            />
            <Playlist
              songs={songs}
              currentSongIndex={currentSongIndex}
              setCurrentSongIndex={setCurrentSongIndex}
            />
          </>
        ) : (
          <YouTubePlayer />
        )}
      </div>
    </div>
  );
}

export default App;

        
