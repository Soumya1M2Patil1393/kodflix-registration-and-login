import { useState, useEffect } from 'react';
import movieService from '../services/movieService';

const HeroBanner = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMovie = async () => {
      try {
        const data = await movieService.getFeaturedMovie();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching featured movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovie();
  }, []);

  if (loading) {
    return <div className="hero-banner loading"></div>;
  }

  if (!movie) {
    return null;
  }

  return (
    <div 
      className="hero-banner"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(20, 20, 20, 0) 0%, rgba(20, 20, 20, 0.8) 60%, #141414 100%), url(${movie.Poster !== 'N/A' ? movie.Poster : ''})`
      }}
    >
      <div className="hero-content">
        <h1 className="hero-title">{movie.Title}</h1>
        <div className="hero-meta">
          <span className="hero-year">{movie.Year}</span>
          <span className="hero-rating">{movie.Rated}</span>
          <span className="hero-runtime">{movie.Runtime}</span>
        </div>
        <p className="hero-description">
          {movie.Plot && movie.Plot.length > 200 
            ? movie.Plot.substring(0, 200) + '...' 
            : movie.Plot}
        </p>
        <div className="hero-buttons">
          <button className="hero-button hero-button-play">
            <span className="play-icon">▶</span> Play
          </button>
          <button className="hero-button hero-button-more">
            <span className="info-icon">ℹ</span> More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
