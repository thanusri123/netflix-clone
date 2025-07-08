import React, { useState, useEffect } from 'react';
import './App.css';
import {
  NetflixHeader,
  HeroSection,
  ContentRow,
  VideoPlayer,
  LoadingSpinner,
  SearchResults
} from './components';

// TMDB API Configuration
const TMDB_API_KEYS = [
  'c8dea14dc917687ac631a52620e4f7ad',
  '3cb41ecea3bf606c56552db3d17adefd'
];
let currentKeyIndex = 0;

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

// Mock images for fallback
const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1700774606224-947aa19b5597',
  'https://images.unsplash.com/photo-1603214767288-205b8cd0dd1e',
  'https://images.pexels.com/photos/7206581/pexels-photo-7206581.jpeg',
  'https://images.unsplash.com/photo-1546803073-23568b8c98e6',
  'https://images.unsplash.com/photo-1588374688595-d7953121375d',
  'https://images.unsplash.com/photo-1700422300101-51c7403efa0e',
  'https://images.unsplash.com/photo-1636008007951-a70d957cfe55'
];

function App() {
  const [loading, setLoading] = useState(true);
  const [featuredContent, setFeaturedContent] = useState(null);
  const [contentRows, setContentRows] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user] = useState({ name: 'Netflix User' });

  // TMDB API call with key rotation
  const tmdbFetch = async (endpoint, retryCount = 0) => {
    const currentKey = TMDB_API_KEYS[currentKeyIndex];
    const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${currentKey}`;
    
    try {
      const response = await fetch(url);
      
      if (response.status === 429 && retryCount < TMDB_API_KEYS.length - 1) {
        // Rate limited, try next key
        currentKeyIndex = (currentKeyIndex + 1) % TMDB_API_KEYS.length;
        return tmdbFetch(endpoint, retryCount + 1);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('TMDB API Error:', error);
      if (retryCount < TMDB_API_KEYS.length - 1) {
        currentKeyIndex = (currentKeyIndex + 1) % TMDB_API_KEYS.length;
        return tmdbFetch(endpoint, retryCount + 1);
      }
      throw error;
    }
  };

  // Get YouTube trailer for content
  const getTrailer = async (contentId, isMovie = true) => {
    try {
      const mediaType = isMovie ? 'movie' : 'tv';
      const data = await tmdbFetch(`/${mediaType}/${contentId}/videos`);
      const trailer = data.results?.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    } catch (error) {
      console.error('Error fetching trailer:', error);
      return null;
    }
  };

  // Transform TMDB data to our format
  const transformContent = (item, isMovie = true, mockImageIndex = 0) => {
    const posterPath = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : MOCK_IMAGES[mockImageIndex % MOCK_IMAGES.length];
    const backdropPath = item.backdrop_path ? `${BACKDROP_BASE_URL}${item.backdrop_path}` : 'https://images.unsplash.com/photo-1542911945-39ed8c8bc9cd';
    
    return {
      id: item.id,
      title: isMovie ? item.title : item.name,
      overview: item.overview || 'No description available.',
      posterImage: posterPath,
      backdropImage: backdropPath,
      releaseDate: isMovie ? item.release_date : item.first_air_date,
      voteAverage: item.vote_average,
      isMovie
    };
  };

  // Mock data for fallback
  const getMockContent = () => {
    const mockMovies = [
      {
        id: 1,
        title: "Stranger Things",
        overview: "A group of young friends in Hawkins, Indiana, discover supernatural forces when their friend mysteriously vanishes.",
        posterImage: MOCK_IMAGES[0],
        backdropImage: "https://images.unsplash.com/photo-1542911945-39ed8c8bc9cd",
        releaseDate: "2016-07-15",
        voteAverage: 8.7,
        isMovie: false
      },
      {
        id: 2,
        title: "The Dark Knight",
        overview: "Batman faces his greatest challenge yet when the Joker wreaks havoc on Gotham City.",
        posterImage: MOCK_IMAGES[1],
        backdropImage: "https://images.unsplash.com/photo-1542911945-39ed8c8bc9cd",
        releaseDate: "2008-07-18",
        voteAverage: 9.0,
        isMovie: true
      },
      {
        id: 3,
        title: "Breaking Bad",
        overview: "A high school chemistry teacher turned methamphetamine manufacturer partners with a former student.",
        posterImage: MOCK_IMAGES[2],
        backdropImage: "https://images.unsplash.com/photo-1542911945-39ed8c8bc9cd",
        releaseDate: "2008-01-20",
        voteAverage: 9.4,
        isMovie: false
      },
      {
        id: 4,
        title: "Inception",
        overview: "A thief who enters people's dreams to steal secrets is given the chance to have his criminal record erased.",
        posterImage: MOCK_IMAGES[3],
        backdropImage: "https://images.unsplash.com/photo-1542911945-39ed8c8bc9cd",
        releaseDate: "2010-07-16",
        voteAverage: 8.8,
        isMovie: true
      },
      {
        id: 5,
        title: "The Witcher",
        overview: "A monster hunter struggles to find his place in a world where people often prove more wicked than beasts.",
        posterImage: MOCK_IMAGES[4],
        backdropImage: "https://images.unsplash.com/photo-1542911945-39ed8c8bc9cd",
        releaseDate: "2019-12-20",
        voteAverage: 8.2,
        isMovie: false
      },
      {
        id: 6,
        title: "Avengers: Endgame",
        overview: "The Avengers assemble once more to undo Thanos' actions and restore order to the universe.",
        posterImage: MOCK_IMAGES[5],
        backdropImage: "https://images.unsplash.com/photo-1542911945-39ed8c8bc9cd",
        releaseDate: "2019-04-26",
        voteAverage: 8.4,
        isMovie: true
      }
    ];

    return {
      featured: mockMovies[0],
      trending: mockMovies.slice(0, 6),
      popular: mockMovies.slice(1, 6),
      topRated: mockMovies.slice(2, 6),
      action: mockMovies.slice(0, 4),
      comedy: mockMovies.slice(1, 5),
      horror: mockMovies.slice(2, 6)
    };
  };

  // Fetch content from TMDB
  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Fetch different content categories
      const [trending, popularMovies, topRatedMovies, popularTV, topRatedTV] = await Promise.all([
        tmdbFetch('/trending/all/week'),
        tmdbFetch('/movie/popular'),
        tmdbFetch('/movie/top_rated'),
        tmdbFetch('/tv/popular'),
        tmdbFetch('/tv/top_rated')
      ]);

      // Transform and organize content
      const trendingContent = trending.results?.map((item, index) => 
        transformContent(item, item.media_type === 'movie', index)
      ) || [];
      
      const popularMoviesContent = popularMovies.results?.map((item, index) => 
        transformContent(item, true, index)
      ) || [];
      
      const topRatedMoviesContent = topRatedMovies.results?.map((item, index) => 
        transformContent(item, true, index)
      ) || [];
      
      const popularTVContent = popularTV.results?.map((item, index) => 
        transformContent(item, false, index)
      ) || [];
      
      const topRatedTVContent = topRatedTV.results?.map((item, index) => 
        transformContent(item, false, index)
      ) || [];

      // Set featured content (first trending item)
      const featured = trendingContent[0] || null;
      setFeaturedContent(featured);

      // Set content rows
      setContentRows([
        { title: 'Trending Now', content: trendingContent.slice(0, 12) },
        { title: 'Popular Movies', content: popularMoviesContent.slice(0, 12) },
        { title: 'Top Rated Movies', content: topRatedMoviesContent.slice(0, 12) },
        { title: 'Popular TV Shows', content: popularTVContent.slice(0, 12) },
        { title: 'Top Rated TV Shows', content: topRatedTVContent.slice(0, 12) }
      ]);
      
    } catch (error) {
      console.error('Error fetching content:', error);
      // Fallback to mock data
      const mockData = getMockContent();
      setFeaturedContent(mockData.featured);
      setContentRows([
        { title: 'Trending Now', content: mockData.trending },
        { title: 'Popular Movies', content: mockData.popular },
        { title: 'Top Rated', content: mockData.topRated },
        { title: 'Action & Adventure', content: mockData.action },
        { title: 'Comedy', content: mockData.comedy },
        { title: 'Horror', content: mockData.horror }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Search functionality
  const handleSearch = async (term) => {
    if (!term.trim()) return;
    
    try {
      setSearchTerm(term);
      const data = await tmdbFetch(`/search/multi?query=${encodeURIComponent(term)}`);
      const results = data.results?.map((item, index) => 
        transformContent(item, item.media_type === 'movie', index)
      ) || [];
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    }
  };

  // Play content
  const handlePlay = async (content) => {
    const trailerUrl = await getTrailer(content.id, content.isMovie);
    if (trailerUrl) {
      setCurrentVideo({ url: trailerUrl, title: content.title });
    } else {
      // Fallback to a sample trailer
      setCurrentVideo({ 
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 
        title: content.title 
      });
    }
  };

  // More info (same as play for now)
  const handleMoreInfo = (content) => {
    handlePlay(content);
  };

  // Content click
  const handleContentClick = (content) => {
    handlePlay(content);
  };

  // Close video
  const handleCloseVideo = () => {
    setCurrentVideo(null);
  };

  // Clear search
  const clearSearch = () => {
    setSearchResults(null);
    setSearchTerm('');
  };

  // Initialize app
  useEffect(() => {
    fetchContent();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-black min-h-screen">
      <NetflixHeader 
        onSearch={handleSearch}
        user={user}
      />
      
      {searchResults !== null ? (
        <>
          <SearchResults 
            results={searchResults}
            onContentClick={handleContentClick}
            searchTerm={searchTerm}
          />
          <button
            onClick={clearSearch}
            className="fixed bottom-8 right-8 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors shadow-lg"
          >
            Back to Home
          </button>
        </>
      ) : (
        <>
          <HeroSection
            featuredContent={featuredContent}
            onPlay={handlePlay}
            onMoreInfo={handleMoreInfo}
          />
          
          <div className="pb-8">
            {contentRows.map((row, index) => (
              <ContentRow
                key={index}
                title={row.title}
                content={row.content}
                onContentClick={handleContentClick}
              />
            ))}
          </div>
        </>
      )}
      
      {currentVideo && (
        <VideoPlayer
          videoUrl={currentVideo.url}
          title={currentVideo.title}
          onClose={handleCloseVideo}
        />
      )}
    </div>
  );
}

export default App;