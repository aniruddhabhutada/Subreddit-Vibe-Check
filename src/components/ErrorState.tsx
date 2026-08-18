import React from 'react';
import { AlertCircle, RefreshCw, Compass } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onSelectExample: (sub: string) => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onSelectExample
}) => {
  return (
    <div className="bg-slate-800/90 border border-rose-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-6 max-w-2xl mx-auto shadow-xl">
      {/* Icon Badge */}
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
        <AlertCircle className="w-7 h-7" />
      </div>

      {/* Human-Friendly Error Message */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">
          Unable to Fetch Subreddit Vibe
        </h3>
        <p className="text-sm text-rose-300/90 leading-relaxed bg-rose-950/40 border border-rose-900/50 p-4 rounded-xl max-w-lg mx-auto font-medium">
          {error}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/20"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>

      {/* Alternative Example Suggestions */}
      <div className="pt-4 border-t border-slate-700/50 space-y-2">
        <span className="text-xs text-slate-400 flex items-center justify-center space-x-1">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Or try checking one of these active subreddits:</span>
        </span>

        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {['programming', 'technology', 'sports', 'movies'].map((sub) => (
            <button
              key={sub}
              type="button"
              onClick={() => onSelectExample(sub)}
              className="px-3 py-1 bg-slate-700/60 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors border border-slate-600/50"
            >
              r/{sub}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
