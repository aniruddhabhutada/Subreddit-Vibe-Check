import React from 'react';
import { RedditPost, FilterOption } from '../types/reddit';
import { PostCard } from './PostCard';
import { Inbox } from 'lucide-react';

interface PostListProps {
  posts: RedditPost[];
  filter: FilterOption;
  onClearFilter?: () => void;
}

export const PostList: React.FC<PostListProps> = ({ posts, filter, onClearFilter }) => {
  if (posts.length === 0) {
    return (
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
          <Inbox className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-slate-200">
          No {filter !== 'all' ? filter : ''} posts found
        </h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          None of the 50 hot posts matched the selected sentiment filter "{filter}".
        </p>
        {onClearFilter && (
          <button
            type="button"
            onClick={onClearFilter}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Show All Posts
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} index={index} />
      ))}
    </div>
  );
};
