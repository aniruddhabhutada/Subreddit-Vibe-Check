import React from 'react';
import { SentimentSummary } from '../types/reddit';
import { formatCompactNumber } from '../utils/formatters';
import { MessageSquare, ArrowUpRight, Smile, Meh, Frown, TrendingUp, Hash } from 'lucide-react';

interface SummaryCardsProps {
  summary: SentimentSummary;
  subreddit: string;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, subreddit }) => {
  return (
    <div className="space-y-4">
      {/* Subreddit Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>r/{subreddit}</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal border border-slate-700">
              Hot Top 50
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time aggregate sentiment analysis for recent top posts
          </p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">

        {/* Card 1: Total Posts */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Posts</span>
            <Hash className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-white">{summary.totalPosts}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Hot posts analyzed</p>
          </div>
        </div>

        {/* Card 2: Positive Posts */}
        <div className="bg-slate-800/80 border border-emerald-500/20 rounded-xl p-3.5 flex flex-col justify-between shadow-sm bg-gradient-to-br from-slate-800/90 to-emerald-950/20">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-medium uppercase tracking-wider">Positive</span>
            <Smile className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-400">{summary.positiveCount}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {summary.totalPosts > 0 ? Math.round((summary.positiveCount / summary.totalPosts) * 100) : 0}% of posts
            </p>
          </div>
        </div>

        {/* Card 3: Neutral Posts */}
        <div className="bg-slate-800/80 border border-indigo-500/20 rounded-xl p-3.5 flex flex-col justify-between shadow-sm bg-gradient-to-br from-slate-800/90 to-indigo-950/20">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-medium uppercase tracking-wider">Neutral</span>
            <Meh className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-indigo-300">{summary.neutralCount}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {summary.totalPosts > 0 ? Math.round((summary.neutralCount / summary.totalPosts) * 100) : 0}% of posts
            </p>
          </div>
        </div>

        {/* Card 4: Negative Posts */}
        <div className="bg-slate-800/80 border border-rose-500/20 rounded-xl p-3.5 flex flex-col justify-between shadow-sm bg-gradient-to-br from-slate-800/90 to-rose-950/20">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-xs font-medium uppercase tracking-wider">Negative</span>
            <Frown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-rose-400">{summary.negativeCount}</span>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {summary.totalPosts > 0 ? Math.round((summary.negativeCount / summary.totalPosts) * 100) : 0}% of posts
            </p>
          </div>
        </div>

        {/* Card 5: Average Sentiment Score */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Avg Score</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2">
            <span className={`text-2xl font-bold ${
              summary.averageSentimentScore > 0 ? 'text-emerald-400' :
              summary.averageSentimentScore < 0 ? 'text-rose-400' : 'text-slate-200'
            }`}>
              {summary.averageSentimentScore > 0 ? `+${summary.averageSentimentScore}` : summary.averageSentimentScore}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Title Sentiment</p>
          </div>
        </div>

        {/* Card 6: Average Post Score (Upvotes) */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Avg Upvotes</span>
            <ArrowUpRight className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-amber-400">
              {formatCompactNumber(summary.averagePostScore)}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Per post</p>
          </div>
        </div>

        {/* Card 7: Total Comments */}
        <div className="col-span-2 sm:col-span-1 bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Comments</span>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-cyan-300">
              {formatCompactNumber(summary.totalComments)}
            </span>
            <p className="text-[10px] text-slate-400 mt-0.5">Total discussion</p>
          </div>
        </div>

      </div>
    </div>
  );
};
