import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import MovieRow from '../components/MovieRow';
import movieService from '../services/movieService';

const Dashboard = () => {
  const [categories, setCategories] = useState({
    trending: [],
    popular: [],
    'top-rated': [],
    'tv-shows': []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setLoading(true);
        
        const [trendingData, popularData, topRatedData, tvShowsData] = await Promise.all([
          movieService.getMoviesByCategory('trending'),
          movieService.getMoviesByCategory('popular'),
          movieService.getMoviesByCategory('top-rated'),
          movieService.getMoviesByCategory('tv-shows')
        ]);

        setCategories({
          trending: trendingData.movies || [],
          popular: popularData.movies || [],
          'top-rated': topRatedData.movies || [],
          'tv-shows': tvShowsData.movies || []
        });
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  return (
    <div className="dashboard">
      <Navbar />
      <HeroBanner />
      
      <div className="dashboard-content">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <MovieRow title="Trending Now" movies={categories.trending} />
            <MovieRow title="Popular on KodFlix" movies={categories.popular} />
            <MovieRow title="Top Rated" movies={categories['top-rated']} />
            <MovieRow title="TV Shows" movies={categories['tv-shows']} />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
