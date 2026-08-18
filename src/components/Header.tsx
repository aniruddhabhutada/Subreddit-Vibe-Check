import React from 'react';
import { Sparkles, Github, Radio, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand logo & Title */}
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                The Subreddit Vibe Check
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-3 h-3 mr-1" /> Live Sentiment
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Client-side sentiment analysis dashboard for Reddit top 50 hot titles
            </p>
          </div>
        </div>

        {/* Action badges & Links */}
        <div className="flex items-center space-x-3 text-xs text-slate-400">
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Client-Side NLP</span>
          </div>

          <a
            href="https://github.com/aniruddhabhutada/Subreddit-Vibe-Check"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-slate-200 hover:text-white transition-colors duration-200"
            aria-label="GitHub Repository"
          >
            <Github className="w-4 h-4" />
            <span className="font-medium">GitHub Repository</span>
          </a>
        </div>

      </div>
    </header>
  );
};
