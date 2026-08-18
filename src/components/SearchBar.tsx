import React, { useState, useEffect } from 'react';
import { Search, Compass, RefreshCw } from 'lucide-react';

interface SearchBarProps {
  onSearch: (subreddit: string, forceRefresh?: boolean) => void;
  loading: boolean;
  currentSubreddit: string;
}

const EXAMPLE_SUBREDDITS = [
  'programming',
  'technology',
  'sports',
  'movies',
  'india',
  'worldnews',
  'learnprogramming'
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  loading,
  currentSubreddit
}) => {
  const [inputValue, setInputValue] = useState<string>(currentSubreddit);

  useEffect(() => {
    if (currentSubreddit) {
      setInputValue(currentSubreddit);
    }
  }, [currentSubreddit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      onSearch(inputValue);
    }
  };

  const handleExampleClick = (sub: string) => {
    setInputValue(sub);
    onSearch(sub);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Main Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <span className="text-slate-500 font-semibold text-base pr-1">r/</span>
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="enter subreddit (e.g. programming, technology, movies)..."
            disabled={loading}
            className="w-full pl-10 pr-32 py-3.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-500 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 shadow-inner disabled:opacity-60"
            aria-label="Subreddit name input"
          />

          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="absolute right-2 top-2 bottom-2 px-5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-600/20"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Vibe Check</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Example Pills */}
      <div className="flex items-center flex-wrap gap-2 text-xs text-slate-400">
        <span className="flex items-center space-x-1 font-medium text-slate-400 pr-1">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Popular Examples:</span>
        </span>
        {EXAMPLE_SUBREDDITS.map((sub) => {
          const isSelected = currentSubreddit.toLowerCase() === sub.toLowerCase();
          return (
            <button
              key={sub}
              type="button"
              onClick={() => handleExampleClick(sub)}
              disabled={loading}
              className={`px-3 py-1 rounded-full border text-xs transition-all duration-200 ${
                isSelected
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 font-semibold shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-600'
              } disabled:opacity-50`}
            >
              r/{sub}
            </button>
          );
        })}
      </div>
    </div>
  );
};
