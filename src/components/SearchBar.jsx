import { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * SearchBar
 * Provides a city name input and a "use my location" button.
 */
const SearchBar = ({ onSearch, onDetectLocation, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  return (
    <div className="flex gap-3 w-full animate-fade-in">
      <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
        {/* Input wrapper */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for a city…"
            disabled={loading}
            aria-label="Search city"
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          />
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-md border border-white/20 text-white rounded-2xl px-5 py-3 font-medium text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          Search
        </button>
      </form>

      {/* Location button */}
      <button
        onClick={onDetectLocation}
        disabled={loading}
        title="Use my location"
        aria-label="Detect my location"
        className="bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md border border-white/20 text-white rounded-2xl px-4 py-3 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <MapPin className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onDetectLocation: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SearchBar;
