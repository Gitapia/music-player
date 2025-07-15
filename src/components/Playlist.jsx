const Playlist = ({ songs, currentSongIndex, setCurrentSongIndex }) => {
  return (
    <div className="playlist">
      <h3>Playlist</h3>
      <ul>
        {songs.map((song, index) => (
          <li 
            key={index} 
            className={index === currentSongIndex ? 'active' : ''}
            onClick={() => setCurrentSongIndex(index)}
          >
            {song.title} - {song.artist}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;