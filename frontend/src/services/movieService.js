import api from './api';

const movieService = {
  searchMovies: async (query, page = 1) => {
    const response = await api.get(`/movies/search?q=${encodeURIComponent(query)}&page=${page}`);
    return response.data;
  },

  getMovieDetails: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  getMoviesByCategory: async (category) => {
    const response = await api.get(`/movies/category/${category}`);
    return response.data;
  },

  getFeaturedMovie: async () => {
    const response = await api.get('/movies/featured/hero');
    return response.data;
  },
};

export default movieService;
