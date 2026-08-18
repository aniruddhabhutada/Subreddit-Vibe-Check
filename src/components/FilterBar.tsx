import React from 'react';
import { FilterOption, SortOption, SentimentSummary } from '../types/reddit';
import { Filter, ArrowUpDown, Smile, Meh, Frown, Layers } from 'lucide-react';

interface FilterBarProps {
  filter: FilterOption;
  setFilter: (f: FilterOption) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  summary: SentimentSummary;
  showingCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  setFilter,
  sortBy,
  setSortBy,
  summary,
  showingCount
}) => {
  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">

      {/* Sentiment Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <span className="text-xs text-slate-400 font-medium flex items-center mr-2">
          <Filter className="w-3.5 h-3.5 mr-1 text-slate-400" />
          Filter:
        </span>

        {/* All Pill */}
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center space-x-1.5 ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All ({summary.totalPosts})</span>
        </button>

        {/* Positive Pill */}
        <button
          type="button"
          onClick={() => setFilter('positive')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center space-x-1.5 ${
            filter === 'positive'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-700/50 text-emerald-400 hover:bg-slate-700'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>Positive ({summary.positiveCount})</span>
        </button>

        {/* Neutral Pill */}
        <button
          type="button"
          onClick={() => setFilter('neutral')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center space-x-1.5 ${
            filter === 'neutral'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-700/50 text-indigo-300 hover:bg-slate-700'
          }`}
        >
          <Meh className="w-3.5 h-3.5" />
          <span>Neutral ({summary.neutralCount})</span>
        </button>

        {/* Negative Pill */}
        <button
          type="button"
          onClick={() => setFilter('negative')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center space-x-1.5 ${
            filter === 'negative'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-slate-700/50 text-rose-400 hover:bg-slate-700'
          }`}
        >
          <Frown className="w-3.5 h-3.5" />
          <span>Negative ({summary.negativeCount})</span>
        </button>
      </div>

      {/* Sorting Control & Showing Count */}
      <div className="flex items-center justify-between md:justify-end space-x-3 text-xs border-t md:border-t-0 border-slate-700/60 pt-2 md:pt-0">
        <span className="text-slate-400 text-xs">
          Showing <span className="font-semibold text-slate-200">{showingCount}</span> of {summary.totalPosts}
        </span>

        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <label htmlFor="sort-select" className="sr-only">Sort posts by</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="score">Sort by Upvotes (High to Low)</option>
            <option value="comments">Sort by Comments (High to Low)</option>
            <option value="sentiment">Sort by Sentiment Score</option>
            <option value="newest">Sort by Newest</option>
          </select>
        </div>
      </div>

    </div>
  );
};
