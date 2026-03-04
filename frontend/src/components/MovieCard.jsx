import { useState } from 'react';

const MovieCard = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    // Could open a modal or navigate to detail page
    console.log('Movie clicked:', movie);
  };

  return (
    <div 
      className={`movie-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <img 
        src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'} 
        alt={movie.Title}
        className="movie-poster"
      />
      {isHovered && (
        <div className="movie-info">
          <h3 className="movie-title">{movie.Title}</h3>
          <p className="movie-year">{movie.Year}</p>
        </div>
      )}
    </div>
  );
};

export default MovieCard;
