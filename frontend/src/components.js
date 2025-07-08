import React, { useState, useEffect, useRef } from 'react';

// Netflix Header Component
export const NetflixHeader = ({ onSearch, user }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <img 
            src="https://images.pexels.com/photos/12261166/pexels-photo-12261166.jpeg" 
            alt="Netflix" 
            className="h-8 w-auto"
          />
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Home</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">TV Shows</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Movies</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">New & Popular</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">My List</a>
          </nav>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {searchVisible ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black border border-gray-600 text-white px-4 py-2 rounded-md focus:outline-none focus:border-white"
                  placeholder="Search movies, shows..."
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => setSearchVisible(false)}
                  className="ml-2 text-white hover:text-gray-300"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchVisible(true)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                🔍
              </button>
            )}
          </div>
          
          {/* Notifications */}
          <button className="text-white hover:text-gray-300 transition-colors">
            🔔
          </button>
          
          {/* Profile */}
          <div className="w-8 h-8 bg-red-600 rounded-md flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Section Component
export const HeroSection = ({ featuredContent, onPlay, onMoreInfo }) => {
  if (!featuredContent) return null;

  return (
    <div className="relative h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(
            to right,
            rgba(0, 0, 0, 0.8) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.1) 100%
          ), url(${featuredContent.backdropImage})`
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl ml-8 md:ml-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          {featuredContent.title}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl">
          {featuredContent.overview}
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={() => onPlay(featuredContent)}
            className="bg-white text-black px-8 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <span>▶</span>
            <span>Play</span>
          </button>
          <button
            onClick={() => onMoreInfo(featuredContent)}
            className="bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded-md font-semibold hover:bg-opacity-50 transition-colors flex items-center space-x-2"
          >
            <span>ℹ</span>
            <span>More Info</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Content Row Component
export const ContentRow = ({ title, content, onContentClick }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScrollButtons);
      return () => scrollElement.removeEventListener('scroll', checkScrollButtons);
    }
  }, [content]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4 px-4 md:px-8">
        {title}
      </h2>
      
      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
          >
            ←
          </button>
        )}
        
        {/* Content Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide space-x-2 px-4 md:px-8 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {content.map((item, index) => (
            <ContentCard
              key={item.id || index}
              content={item}
              onClick={() => onContentClick(item)}
            />
          ))}
        </div>
        
        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
          >
            →
          </button>
        )}
      </div>
    </div>
  );
};

// Content Card Component
export const ContentCard = ({ content, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div
      className="flex-shrink-0 w-48 md:w-56 cursor-pointer transform transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative rounded-lg overflow-hidden bg-gray-800">
        {!imageError ? (
          <img
            src={content.posterImage}
            alt={content.title}
            className="w-full h-72 md:h-80 object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-72 md:h-80 bg-gray-700 flex items-center justify-center">
            <span className="text-white text-center p-4">{content.title}</span>
          </div>
        )}
        
        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <h3 className="font-semibold mb-2">{content.title}</h3>
              <p className="text-sm text-gray-300 mb-4 line-clamp-3">{content.overview}</p>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                ▶ Play
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Video Player Modal
export const VideoPlayer = ({ videoUrl, title, onClose }) => {
  if (!videoUrl) return null;

  // Extract YouTube video ID from various URL formats
  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 z-10"
        >
          ✕
        </button>
        
        <div className="bg-black rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-white text-xl font-semibold">{title}</h2>
          </div>
          
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={title}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <p className="text-white">Video not available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Component
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
);

// Search Results Component
export const SearchResults = ({ results, onContentClick, searchTerm }) => {
  if (!results || results.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-20 px-4 md:px-8">
        <h2 className="text-white text-2xl mb-8">Search Results for "{searchTerm}"</h2>
        <p className="text-gray-400">No results found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 px-4 md:px-8">
      <h2 className="text-white text-2xl mb-8">Search Results for "{searchTerm}"</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.map((item, index) => (
          <ContentCard
            key={item.id || index}
            content={item}
            onClick={() => onContentClick(item)}
          />
        ))}
      </div>
    </div>
  );
};