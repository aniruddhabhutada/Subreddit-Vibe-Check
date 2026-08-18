import React from 'react';
import { RedditPost } from '../types/reddit';
import { formatCompactNumber, formatRelativeTime } from '../utils/formatters';
import { ArrowUpRight, MessageSquare, ExternalLink, Smile, Meh, Frown, User, Clock, AlertTriangle } from 'lucide-react';

interface PostCardProps {
  post: RedditPost;
  index: number;
}

export const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
  const getBadgeStyle = () => {
    switch (post.sentimentLabel) {
      case 'positive':
        return {
          badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <Smile className="w-3.5 h-3.5" />,
          label: 'Positive',
          scorePrefix: '+'
        };
      case 'negative':
        return {
          badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          icon: <Frown className="w-3.5 h-3.5" />,
          label: 'Negative',
          scorePrefix: ''
        };
      default:
        return {
          badgeClass: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
          icon: <Meh className="w-3.5 h-3.5" />,
          label: 'Neutral',
          scorePrefix: post.sentimentScore > 0 ? '+' : ''
        };
    }
  };

  const style = getBadgeStyle();

  return (
    <article className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-sm flex flex-col justify-between group">
      <div>
        {/* Top Header: Index #, Sentiment Badge, NSFW indicator */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-slate-500 w-6">
              #{index + 1}
            </span>

            {/* Sentiment Badge */}
            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${style.badgeClass}`}>
              {style.icon}
              <span>{style.label}</span>
              <span className="opacity-80 font-mono">({style.scorePrefix}{post.sentimentScore})</span>
            </span>

            {post.isNsfw && (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold">
                <AlertTriangle className="w-3 h-3" />
                <span>NSFW</span>
              </span>
            )}
          </div>

          <span className="text-xs text-slate-400 font-mono">
            r/{post.subreddit}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-slate-100 group-hover:text-indigo-200 transition-colors leading-snug mb-3">
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="focus:outline-none focus:underline"
          >
            {post.title}
          </a>
        </h3>

        {/* Sentiment Keywords detected */}
        {(post.positiveWords.length > 0 || post.negativeWords.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px]">
            {post.positiveWords.map((word, i) => (
              <span key={`pos-${i}`} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                +{word}
              </span>
            ))}
            {post.negativeWords.map((word, i) => (
              <span key={`neg-${i}`} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                -{word}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        
        {/* Left Stats: Author, Time, Score, Comments */}
        <div className="flex items-center flex-wrap gap-4">
          {/* Upvotes */}
          <div className="flex items-center space-x-1 text-amber-400 font-semibold" title="Upvotes">
            <ArrowUpRight className="w-4 h-4" />
            <span>{formatCompactNumber(post.score)}</span>
          </div>

          {/* Comments */}
          <div className="flex items-center space-x-1 text-cyan-300" title="Comments">
            <MessageSquare className="w-4 h-4" />
            <span>{formatCompactNumber(post.comments)}</span>
          </div>

          {/* Author */}
          <div className="flex items-center space-x-1 text-slate-400" title="Author">
            <User className="w-3.5 h-3.5" />
            <span className="truncate max-w-[120px]">{post.author}</span>
          </div>

          {/* Posted Time */}
          <div className="flex items-center space-x-1 text-slate-400" title="Posted time">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatRelativeTime(post.createdAt)}</span>
          </div>
        </div>

        {/* Right Button: Open on Reddit */}
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-indigo-600 text-slate-200 hover:text-white transition-all duration-200 text-xs font-medium border border-slate-600/60 hover:border-indigo-500 shadow-sm"
        >
          <span>Open on Reddit</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

      </div>
    </article>
  );
};
