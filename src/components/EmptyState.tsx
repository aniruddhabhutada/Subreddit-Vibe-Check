import React from 'react';
import { Compass, Sparkles, MessageSquare, ShieldCheck, Activity } from 'lucide-react';

interface EmptyStateProps {
  onSelectExample: (sub: string) => void;
}

const FEATURED_COMMUNITIES = [
  { name: 'programming', desc: 'Tech news, articles, and software discussions' },
  { name: 'technology', desc: 'Latest innovations, gadgets, and tech industry' },
  { name: 'sports', desc: 'Scores, highlights, and sports news' },
  { name: 'movies', desc: 'Film reviews, trailers, and cinema news' },
  { name: 'india', desc: 'News, culture, and discussions from India' },
  { name: 'worldnews', desc: 'Major international news and developments' },
  { name: 'learnprogramming', desc: 'Coding tutorials and beginner questions' }
];

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectExample }) => {
  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-4xl mx-auto shadow-xl">
      
      {/* Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
        <Sparkles className="w-8 h-8 text-white animate-pulse" />
      </div>

      {/* Primary Message */}
      <div className="space-y-2 max-w-lg mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Enter a subreddit to see its vibe.
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Instantly fetch the top 50 Hot posts from any subreddit, run client-side NLP sentiment analysis on their titles, and visualize overall community vibe.
        </p>
      </div>

      {/* Quick Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-2xl mx-auto text-left">
        <div className="bg-slate-800/90 border border-slate-700/60 p-3.5 rounded-xl flex items-start space-x-3">
          <Activity className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-200">50 Hot Titles</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Fetches actual top hot posts from Reddit API</p>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/60 p-3.5 rounded-xl flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-200">Client-Side NLP</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Powered by AFINN-165 sentiment lexicon in browser</p>
          </div>
        </div>

        <div className="bg-slate-800/90 border border-slate-700/60 p-3.5 rounded-xl flex items-start space-x-3">
          <MessageSquare className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-slate-200">Full Dashboard</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">Filter by sentiment & sort by score, comments, date</p>
          </div>
        </div>
      </div>

      {/* Suggested Subreddits List */}
      <div className="pt-4 border-t border-slate-700/50">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-center space-x-1.5 mb-4">
          <Compass className="w-4 h-4 text-indigo-400" />
          <span>Click any community below to get started immediately:</span>
        </span>

        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {FEATURED_COMMUNITIES.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => onSelectExample(item.name)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 text-slate-200 hover:text-white transition-all duration-200 text-xs font-medium flex items-center space-x-1.5 group shadow-sm"
            >
              <span className="text-indigo-400 font-semibold group-hover:text-indigo-300">r/{item.name}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
