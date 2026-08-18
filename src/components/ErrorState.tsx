import React from 'react';
import { AlertCircle, RefreshCw, Database, KeyRound, Compass } from 'lucide-react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
  onSelectExample: (sub: string) => void;
  onEnableDemoMode?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  onRetry,
  onSelectExample,
  onEnableDemoMode
}) => {
  const isCredentialError = error.toLowerCase().includes('credential') || error.toLowerCase().includes('authentication') || error.toLowerCase().includes('401');

  return (
    <div className="bg-slate-800/90 border border-rose-500/30 rounded-3xl p-8 sm:p-10 text-center space-y-6 max-w-3xl mx-auto shadow-xl">
      
      {/* Icon Badge */}
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
        {isCredentialError ? <KeyRound className="w-7 h-7 text-amber-400" /> : <AlertCircle className="w-7 h-7" />}
      </div>

      {/* Error Message Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">
          {isCredentialError ? 'Reddit API Credentials Required for Live Data' : 'Unable to Fetch Subreddit Vibe'}
        </h3>

        <div className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/80 border border-slate-700/80 p-4 rounded-2xl max-w-xl mx-auto text-left space-y-2">
          <p className="text-rose-300 font-medium">{error}</p>

          {isCredentialError && (
            <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">To enable Live Reddit API Data:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                <li>Add <code className="text-indigo-300">REDDIT_CLIENT_ID</code> to Netlify Site Environment Variables.</li>
                <li>Add <code className="text-indigo-300">REDDIT_CLIENT_SECRET</code> to Netlify Site Environment Variables.</li>
                <li>Add <code className="text-indigo-300">REDDIT_USER_AGENT</code> to Netlify Site Environment Variables.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        {onEnableDemoMode && (
          <button
            type="button"
            onClick={onEnableDemoMode}
            className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30"
          >
            <Database className="w-4 h-4" />
            <span>Switch to Demo Mode (Preview UI with Sample Data)</span>
          </button>
        )}

        <button
          type="button"
          onClick={onRetry}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-center space-x-2 border border-slate-600"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Live API</span>
        </button>
      </div>

      {/* Community Pills */}
      <div className="pt-4 border-t border-slate-700/50 space-y-2">
        <span className="text-xs text-slate-400 flex items-center justify-center space-x-1">
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Or try selecting one of these communities:</span>
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
