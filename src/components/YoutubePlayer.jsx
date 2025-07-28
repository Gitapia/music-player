import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

const YouTubeContainer = styled.div`
  background: rgba(30, 30, 30, 0.8);
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xlarge};
  max-width: 800px;
  margin: ${({ theme }) => theme.spacing.xlarge} auto;
  color: ${({ theme }) => theme.colors.text};
`;

const SearchForm = styled.form`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.medium};
`;

const SearchButton = styled.button`
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.xlarge};
  background: #ff0000;
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  cursor: pointer;
  font-weight: bold;
  transition: background ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: #cc0000;
  }
`;

const ResultsContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const VideoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  transition: background ${({ theme }) => theme.transitions.normal};
  background: ${({ active, theme }) => 
    active ? 'rgba(255, 0, 0, 0.2)' : theme.colors.background};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const VideoThumbnail = styled.img`
  width: 60px;
  height: 45px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  object-fit: cover;
`;

const VideoInfo = styled.div`
  flex: 1;
`;

const VideoTitle = styled.h4`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VideoChannel = styled.p`
  margin: ${({ theme }) => theme.spacing.xsmall} 0 0;
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.medium};
  background: rgba(0, 0, 0, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.medium};
`;

const PlayPauseButton = styled.button`
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.xlarge};
  background: #ff0000;
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.large};
  cursor: pointer;
  font-weight: bold;
`;

const NowPlaying = styled.div`
  flex: 1;
`;

const YouTubePlayer = () => {
  // ... (lógica del componente permanece igual)

  // Add missing state and refs for demonstration (replace with your actual logic)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const searchInputRef = useRef(null);

  // Define handleSearch function
  const handleSearch = async (e) => {
    e.preventDefault();
    // Example: Dummy search logic to demonstrate setSearchResults usage
    // Replace this with your actual YouTube API call
    setSearchResults([
      {
        id: { videoId: 'dQw4w9WgXcQ' },
        snippet: {
          title: 'Rick Astley - Never Gonna Give You Up',
          channelTitle: 'RickAstleyVEVO',
          thumbnails: {
            default: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/default.jpg' }
          }
        }
      }
    ]);
  };

  // Dummy playVideo and pauseVideo functions for demonstration
  const playVideo = (videoId) => {
    setCurrentVideoId(videoId);
    setIsPlaying(true);
  };

  const pauseVideo = () => {
    setIsPlaying(false);
  };
  
  return (
    <YouTubeContainer>
      <h2>Reproductor de YouTube</h2>
      
      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar música..."
          ref={searchInputRef}
        />
        <SearchButton type="submit">Buscar</SearchButton>
      </SearchForm>
      
      <ResultsContainer>
        {searchResults.map((item) => (
          <VideoItem
            key={item.id.videoId}
            active={currentVideoId === item.id.videoId}
            onClick={() => playVideo(item.id.videoId)}
          >
            <VideoThumbnail 
              src={item.snippet.thumbnails.default.url} 
              alt={item.snippet.title}
            />
            <VideoInfo>
              <VideoTitle>{item.snippet.title}</VideoTitle>
              <VideoChannel>{item.snippet.channelTitle}</VideoChannel>
            </VideoInfo>
          </VideoItem>
        ))}
      </ResultsContainer>
      
      <ControlsContainer>
        {currentVideoId && (
          <>
            <PlayPauseButton onClick={isPlaying ? pauseVideo : () => playVideo(currentVideoId)}>
              {isPlaying ? 'Pausar' : 'Reproducir'}
            </PlayPauseButton>
            
            <NowPlaying>
              <h3>
                {searchResults.find(v => v.id.videoId === currentVideoId)?.snippet.title}
              </h3>
            </NowPlaying>
          </>
        )}
      </ControlsContainer>
    </YouTubeContainer>
  );
};

export default YouTubePlayer;