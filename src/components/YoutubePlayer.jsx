import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';

const YouTubePlayer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentVideoId, setCurrentVideoId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const searchInputRef = useRef(null);

  // Reemplaza con tu API Key de YouTube
  const YOUTUBE_API_KEY = 'AIzaSyBBTMg_KBWuabrNWAjaGX6ms8WRQsrXzMI';

  // Opciones para el reproductor de YouTube
  const opts = {
    height: '0', // Altura 0 porque controlaremos la reproducción programáticamente
    width: '0',
    playerVars: {
      autoplay: 1,
    },
  };

  // Buscar videos en YouTube
  const searchVideos = async (query) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: 'snippet',
            maxResults: 10,
            key: YOUTUBE_API_KEY,
            q: query,
            type: 'video',
            videoCategoryId: '10', // Categoría de música
          },
        }
      );
      setSearchResults(response.data.items);
    } catch (error) {
      console.error('Error searching videos:', error);
    }
  };

  // Manejar envío del formulario de búsqueda
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchVideos(searchQuery);
    }
  };

  // Reproducir un video específico
  const playVideo = (videoId) => {
    setCurrentVideoId(videoId);
    setIsPlaying(true);
    if (player) {
      player.playVideo();
    }
  };

  // Pausar la reproducción
  const pauseVideo = () => {
    if (player) {
      player.pauseVideo();
      setIsPlaying(false);
    }
  };

  // Eventos del reproductor de YouTube
  const onPlayerReady = (event) => {
    setPlayer(event.target);
    if (currentVideoId && isPlaying) {
      event.target.playVideo();
    }
  };

  // Efecto para enfocar el input al cargar
  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  return (
    <div className="youtube-player-container">
      <h2>Reproductor de YouTube</h2>
      
      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar música..."
          ref={searchInputRef}
        />
        <button type="submit">Buscar</button>
      </form>
      
      {/* Lista de resultados */}
      <div className="search-results">
        {searchResults.map((item) => (
          <div 
            key={item.id.videoId} 
            className={`video-item ${currentVideoId === item.id.videoId ? 'active' : ''}`}
            onClick={() => playVideo(item.id.videoId)}
          >
            <img 
              src={item.snippet.thumbnails.default.url} 
              alt={item.snippet.title}
            />
            <div className="video-info">
              <h4>{item.snippet.title}</h4>
              <p>{item.snippet.channelTitle}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Controles de reproducción */}
      <div className="player-controls">
        {currentVideoId && (
          <>
            <button 
              onClick={isPlaying ? pauseVideo : () => playVideo(currentVideoId)}
              className="play-pause-btn"
            >
              {isPlaying ? 'Pausar' : 'Reproducir'}
            </button>
            
            <div className="now-playing">
              <h3>
                {searchResults.find(v => v.id.videoId === currentVideoId)?.snippet.title}
              </h3>
            </div>
          </>
        )}
      </div>
      
      {/* Reproductor de YouTube (oculto) */}
      {currentVideoId && (
        <div className="youtube-embed">
          <YouTube
            videoId={currentVideoId}
            opts={opts}
            onReady={onPlayerReady}
          />
        </div>
      )}
    </div>
  );
};

export default YouTubePlayer;