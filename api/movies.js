const express = require('express');
const axios = require('axios');

const router = express.Router();
const OMDB_BASE_URL = 'http://www.omdbapi.com';
const OMDB_API_KEY = process.env.OMDB_API_KEY || '99495b68';

// Category search terms mapping
const categorySearches = {
    trending: ['2024', 'action', 'adventure'],
    popular: ['marvel', 'star wars', 'batman', 'avengers'],
    'top-rated': ['godfather', 'shawshank', 'dark knight', 'pulp fiction'],
    'tv-shows': ['breaking bad', 'game of thrones', 'stranger things', 'witcher']
};

// Search movies
router.get('/search', async (req, res) => {
    try {
        const { q, page = 1 } = req.query;
        
        if (!q) {
            return res.status(400).json({ message: 'Search query required' });
        }
        
        const response = await axios.get(OMDB_BASE_URL, {
            params: {
                apikey: OMDB_API_KEY,
                s: q,
                page: page,
                type: 'movie'
            }
        });
        
        if (response.data.Response === 'False') {
            return res.status(404).json({ message: response.data.Error || 'No movies found' });
        }
        
        res.json({
            movies: response.data.Search,
            totalResults: response.data.totalResults
        });
    } catch (error) {
        console.error('Search error:', error.message);
        res.status(500).json({ message: 'Error fetching movies' });
    }
});

// Get movie details by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const response = await axios.get(OMDB_BASE_URL, {
            params: {
                apikey: OMDB_API_KEY,
                i: id,
                plot: 'full'
            }
        });
        
        if (response.data.Response === 'False') {
            return res.status(404).json({ message: 'Movie not found' });
        }
        
        res.json(response.data);
    } catch (error) {
        console.error('Movie detail error:', error.message);
        res.status(500).json({ message: 'Error fetching movie details' });
    }
});

// Get movies by category
router.get('/category/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const searchTerms = categorySearches[type];
        
        if (!searchTerms) {
            return res.status(400).json({ message: 'Invalid category' });
        }
        
        // Pick a random search term from the category
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        
        const response = await axios.get(OMDB_BASE_URL, {
            params: {
                apikey: OMDB_API_KEY,
                s: randomTerm,
                page: 1
            }
        });
        
        if (response.data.Response === 'False') {
            return res.status(404).json({ message: 'No movies found' });
        }
        
        res.json({
            category: type,
            movies: response.data.Search
        });
    } catch (error) {
        console.error('Category error:', error.message);
        res.status(500).json({ message: 'Error fetching category' });
    }
});

// Get featured movie (for hero banner)
router.get('/featured/hero', async (req, res) => {
    try {
        // Get a popular movie for the hero banner
        const response = await axios.get(OMDB_BASE_URL, {
            params: {
                apikey: OMDB_API_KEY,
                s: 'inception',
                page: 1
            }
        });
        
        if (response.data.Response === 'False') {
            return res.status(404).json({ message: 'No featured movie found' });
        }
        
        // Get detailed info for the first movie
        const firstMovie = response.data.Search[0];
        const detailResponse = await axios.get(OMDB_BASE_URL, {
            params: {
                apikey: OMDB_API_KEY,
                i: firstMovie.imdbID,
                plot: 'full'
            }
        });
        
        res.json(detailResponse.data);
    } catch (error) {
        console.error('Featured error:', error.message);
        res.status(500).json({ message: 'Error fetching featured movie' });
    }
});

module.exports = router;
