import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  subreddit: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ subreddit }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Loading Header Feedback */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-6 text-center space-y-3 shadow-md">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white flex items-center justify-center space-x-2">
            <span>Fetching Reddit posts...</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Downloading top 50 hot posts from <span className="text-indigo-300 font-medium">r/{subreddit}</span> and calculating client-side sentiment.
          </p>
        </div>
      </div>

      {/* Summary Skeleton Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3.5 space-y-2 animate-pulse">
            <div className="h-3 bg-slate-700/60 rounded w-12"></div>
            <div className="h-6 bg-slate-700/80 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-800/60 border border-slate-700/40 rounded-2xl p-6 h-64 animate-pulse flex items-center justify-center">
          <div className="w-36 h-36 rounded-full border-4 border-slate-700/60 border-t-indigo-500 animate-spin"></div>
        </div>
        <div className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-6 h-64 animate-pulse space-y-4">
          <div className="h-4 bg-slate-700/60 rounded w-24"></div>
          <div className="w-16 h-16 bg-slate-700/60 rounded-2xl mx-auto"></div>
          <div className="h-6 bg-slate-700/80 rounded w-32 mx-auto"></div>
        </div>
      </div>

      {/* Post List Skeleton Cards */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800/60 border border-slate-700/40 rounded-2xl p-5 space-y-3 animate-pulse">
            <div className="flex justify-between">
              <div className="h-5 bg-slate-700/60 rounded w-24"></div>
              <div className="h-4 bg-slate-700/40 rounded w-16"></div>
            </div>
            <div className="h-5 bg-slate-700/80 rounded w-5/6"></div>
            <div className="h-4 bg-slate-700/50 rounded w-2/3"></div>
          </div>
        ))}
      </div>

    </div>
  );
};
