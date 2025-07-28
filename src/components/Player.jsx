import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';
import { 
  FaPlay, FaPause, FaStepForward, FaStepBackward, 
  FaVolumeUp, FaVolumeMute, FaRandom, FaRedo 
} from 'react-icons/fa';
import { Howl } from 'howler';

const PlayerContainer = styled.div`
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xlarge};
  max-width: 500px;
  margin: 0 auto;
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const SongInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const AlbumCover = styled.img`
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  object-fit: cover;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const SongText = styled.div`
  flex: 1;
`;

const SongTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const SongArtist = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.spacing.small} 0 0;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const TimeDisplay = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  min-width: 40px;
`;

const ProgressBar = styled.input.attrs({ type: 'range' })`
  flex-grow: 1;
  height: 6px;
  -webkit-appearance: none;
  background: ${({ theme }) => theme.colors.textDisabled};
  border-radius: 3px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    cursor: pointer;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.large};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  padding: ${({ theme }) => theme.spacing.small};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PlayButton = styled(ControlButton)`
  background: ${({ theme }) => theme.colors.primary};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
    color: white;
    transform: scale(1.05);
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

const VolumeButton = styled(ControlButton)`
  font-size: ${({ theme }) => theme.fontSizes.large};
`;

const VolumeSlider = styled.input.attrs({ type: 'range' })`
  width: 100px;
  height: 4px;
  -webkit-appearance: none;
  background: ${({ theme }) => theme.colors.textDisabled};
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    cursor: pointer;
  }
`;

const formatTime = (seconds) => {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const Player = ({ songs, currentSongIndex }) => {
  // Player state
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [isRepeatOn, setIsRepeatOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const soundRef = useRef(null);

  // Initialize Howl and handle song changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload();
    }
    const sound = new Howl({
      src: [songs[currentSongIndex].src],
      html5: true,
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(sound.duration());
      },
      onend: () => {
        setIsPlaying(false);
        if (isRepeatOn) {
          sound.seek(0);
          sound.play();
        } else {
          handleNext();
        }
      }
    });
    soundRef.current = sound;
    setCurrentTime(0);
    setDuration(sound.duration() || 0);
    if (isPlaying) {
      sound.play();
    }
    return () => {
      sound.unload();
    };
    // eslint-disable-next-line
  }, [currentSongIndex]);

  // Update progress based on currentTime and duration
  useEffect(() => {
    let interval = null;
    if (isPlaying && soundRef.current) {
      interval = setInterval(() => {
        setCurrentTime(soundRef.current.seek() || 0);
        setDuration(soundRef.current.duration() || 0);
      }, 500);
    } else if (!isPlaying && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (typeof currentTime === 'number' && typeof duration === 'number' && duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);

  // Handlers
  const togglePlay = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
      setIsPlaying(false);
    } else {
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    // Implement previous song logic
  };

  const handleNext = () => {
    // Implement next song logic
  };

  const toggleShuffle = () => {
    setIsShuffleOn((prev) => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeatOn((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      if (soundRef.current) {
        soundRef.current.mute(!prev);
      }
      return !prev;
    });
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
    if (newVolume === 0) setIsMuted(true);
    else setIsMuted(false);
  };

  const handleProgressChange = (e) => {
    const percent = parseFloat(e.target.value);
    const seekTime = (percent / 100) * duration;
    setCurrentTime(seekTime);
    if (soundRef.current) {
      soundRef.current.seek(seekTime);
    }
  };
  
  return (
    <PlayerContainer>
      <SongInfo>
        <AlbumCover 
          src={songs[currentSongIndex].cover || '/default-cover.jpg'} 
          alt="Album cover" 
        />
        <SongText>
          <SongTitle>{songs[currentSongIndex].title}</SongTitle>
          <SongArtist>{songs[currentSongIndex].artist}</SongArtist>
        </SongText>
      </SongInfo>
      
      <ProgressContainer>
        <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
        <ProgressBar
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
        />
        <TimeDisplay>{formatTime(duration)}</TimeDisplay>
      </ProgressContainer>
      
      <Controls>
        <ControlButton 
          onClick={toggleShuffle}
          className={isShuffleOn ? 'active' : ''}
        >
          <FaRandom />
        </ControlButton>
        
        <ControlButton onClick={handlePrev}>
          <FaStepBackward />
        </ControlButton>
        
        <PlayButton onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </PlayButton>
        
        <ControlButton onClick={handleNext}>
          <FaStepForward />
        </ControlButton>
        
        <ControlButton 
          onClick={toggleRepeat}
          className={isRepeatOn ? 'active' : ''}
        >
          <FaRedo />
        </ControlButton>
      </Controls>
      
      <VolumeControl>
        <VolumeButton onClick={toggleMute}>
          {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
        </VolumeButton>
        <VolumeSlider
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </VolumeControl>
    </PlayerContainer>
  );
};

export default Player;