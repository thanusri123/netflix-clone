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

function App() {
  const [loading, setLoading] = useState(false);
  const [featuredContent, setFeaturedContent] = useState(null);
  const [contentRows, setContentRows] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [user] = useState({ name: 'Netflix User' });

  // Simplified mock fetch to simulate API data
  const fetchContent = async () => {
    setLoading(true);
    // Instead of real API calls, just set some mock content
    const mockFeatured = { id: 1, title: 'Sample Movie', overview: 'Overview here', isMovie: true };
    const mockRows = [
      { title: 'Trending Now', content: [mockFeatured] },
      { title: 'Popular Movies', content: [mockFeatured] },
    ];
    setFeaturedContent(mockFeatured);
    setContentRows(mockRows);
    setLoading(false);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    // no real search, just clear results
    setSearchResults(null);
  };

  const handlePlay = (content) => {
    setCurrentVideo({ url: 'https://youtube.com/sample', title: content.title });
  };

  const handleCloseVideo = () => setCurrentVideo(null);
  const clearSearch = () => setSearchResults(null);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-black min-h-screen">
      <NetflixHeader onSearch={handleSearch} user={user} />

      {searchResults !== null ? (
        <>
          <SearchResults results={searchResults} onContentClick={handlePlay} searchTerm={searchTerm} />
          <button onClick={clearSearch} className="fixed bottom-8 right-8 bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors shadow-lg">
            Back to Home
          </button>
        </>
      ) : (
        <>
          <HeroSection featuredContent={featuredContent} onPlay={handlePlay} onMoreInfo={handlePlay} />
          <div className="pb-8">
            {contentRows.map((row, idx) => (
              <ContentRow key={idx} title={row.title} content={row.content} onContentClick={handlePlay} />
            ))}
          </div>
        </>
      )}

      {currentVideo && (
        <VideoPlayer videoUrl={currentVideo.url} title={currentVideo.title} onClose={handleCloseVideo} />
      )}
    </div>
  );
}

export default App;
