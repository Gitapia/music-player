import { useState, useRef, useEffect } from 'react';
import { 
  FaPlay, FaPause, FaStepForward, FaStepBackward, 
  FaVolumeUp, FaVolumeMute, FaRandom, FaRedo 
} from 'react-icons/fa';
import { Howl } from 'howler';

const Player = ({ songs, currentSongIndex, setCurrentSongIndex }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  
  const soundRef = useRef(null);
  const progressInterval = useRef(null);

  // Formatear tiempo (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Inicializar reproductor
  const initSound = () => {
    if (soundRef.current) {
      soundRef.current.unload();
    }

    soundRef.current = new Howl({
      src: [songs[currentSongIndex].url],
      volume: isMuted ? 0 : volume,
      html5: true,
      onplay: () => {
        setIsPlaying(true);
        startProgressTimer();
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        if (isRepeatOn) {
          soundRef.current.seek(0);
          soundRef.current.play();
        } else {
          handleNext();
        }
      },
      onload: () => {
        setDuration(soundRef.current.duration());
        if (isPlaying) {
          soundRef.current.play();
        }
      },
    });
  };

  // Timer para la barra de progreso
  const startProgressTimer = () => {
    clearInterval(progressInterval.current);
    
    progressInterval.current = setInterval(() => {
      if (soundRef.current) {
        const seek = soundRef.current.seek() || 0;
        setCurrentTime(seek);
        setProgress((seek / duration) * 100);
      }
    }, 1000);
  };

  // Efectos
  useEffect(() => {
    initSound();
    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
      clearInterval(progressInterval.current);
    };
  }, [currentSongIndex, songs]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  // Controladores
  const togglePlay = () => {
    if (!soundRef.current) return;
    
    if (isPlaying) {
      soundRef.current.pause();
      clearInterval(progressInterval.current);
    } else {
      soundRef.current.play();
    }
  };

  const handleNext = () => {
    let nextIndex;
    
    if (isShuffleOn) {
      nextIndex = Math.floor(Math.random() * songs.length);
      while (nextIndex === currentSongIndex && songs.length > 1) {
        nextIndex = Math.floor(Math.random() * songs.length);
      }
    } else {
      nextIndex = currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
    }
    
    setCurrentSongIndex(nextIndex);
  };

  const handlePrev = () => {
    setCurrentSongIndex(prev => 
      prev === 0 ? songs.length - 1 : prev - 1
    );
  };

  const handleProgressChange = (e) => {
    const newProgress = e.target.value;
    const seek = (newProgress / 100) * duration;
    
    setProgress(newProgress);
    setCurrentTime(seek);
    
    if (soundRef.current) {
      soundRef.current.seek(seek);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };

  const toggleRepeat = () => {
    setIsRepeatOn(!isRepeatOn);
  };

  return (
    <div className="player-container">
      {/* Información de la canción */}
      <div className="song-info">
        <img 
          src={songs[currentSongIndex].cover || '/default-cover.jpg'} 
          alt="Album cover" 
          className="album-cover"
        />
        <div>
          <h3 className="song-title">{songs[currentSongIndex].title}</h3>
          <p className="song-artist">{songs[currentSongIndex].artist}</p>
        </div>
      </div>
      
      {/* Barra de progreso */}
      <div className="progress-container">
        <span className="time-current">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="progress-bar"
        />
        <span className="time-total">{formatTime(duration)}</span>
      </div>
      
      {/* Controles principales */}
      <div className="main-controls">
        <button 
          onClick={toggleShuffle}
          className={`control-btn ${isShuffleOn ? 'active' : ''}`}
        >
          <FaRandom />
        </button>
        
        <button onClick={handlePrev} className="control-btn">
          <FaStepBackward />
        </button>
        
        <button onClick={togglePlay} className="play-btn">
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        
        <button onClick={handleNext} className="control-btn">
          <FaStepForward />
        </button>
        
        <button 
          onClick={toggleRepeat}
          className={`control-btn ${isRepeatOn ? 'active' : ''}`}
        >
          <FaRedo />
        </button>
      </div>
      
      {/* Control de volumen */}
      <div className="volume-control">
        <button onClick={toggleMute} className="volume-btn">
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>
    </div>
  );
};

export default Player;