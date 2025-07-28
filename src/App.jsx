import styled from 'styled-components';
import { useState } from 'react';
import Player from './components/Player';
import YouTubePlayer from './components/YouTubePlayer';

const AppContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xlarge};
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
  color: ${({ theme }) => theme.colors.primary};
`;

const PlayerSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const SelectorButton = styled.button`
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.xlarge};
  background: ${({ active, theme }) => 
    active ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ active, theme }) => 
      active ? theme.colors.primaryLight : 'rgba(255, 255, 255, 0.2)'};
  }
`;

function App() {
  const [activePlayer, setActivePlayer] = useState('local');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const localSongs = [
    {
      title: "Canción de Ejemplo",
      artist: "Artista Desconocido",
      url: "/songs/sample.mp3",
      cover: "/covers/default.jpg"
    }
  ];

  return (
    <AppContainer>
      <Title>Reproductor de Música</Title>
      
      <PlayerSelector>
        <SelectorButton 
          active={activePlayer === 'local'}
          onClick={() => setActivePlayer('local')}
        >
          Reproductor Local
        </SelectorButton>
        <SelectorButton 
          active={activePlayer === 'youtube'}
          onClick={() => setActivePlayer('youtube')}
        >
          Reproductor YouTube
        </SelectorButton>
      </PlayerSelector>

      {activePlayer === 'local' ? (
        <Player 
          songs={localSongs} 
          currentSongIndex={currentSongIndex} 
          setCurrentSongIndex={setCurrentSongIndex} 
        />
      ) : (
        <YouTubePlayer />
      )}
    </AppContainer>
  );
}

export default App;