import { useRef } from 'react';
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { current } = rowRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="movie-row">
      <h2 className="row-title">{title}</h2>
      <div className="row-container">
        <button 
          className="row-arrow row-arrow-left"
          onClick={() => scroll('left')}
        >
          ‹
        </button>
        
        <div className="row-movies" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
        
        <button 
          className="row-arrow row-arrow-right"
          onClick={() => scroll('right')}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
