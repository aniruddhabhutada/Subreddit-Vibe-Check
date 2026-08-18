import { useState, useMemo, useCallback } from 'react';
import { RedditPost, SentimentSummary, FilterOption, SortOption } from '../types/reddit';
import { fetchSubredditHotPosts } from '../services/redditApi';
import { calculateSentimentSummary } from '../utils/sentiment';
import { normalizeSubredditName } from '../utils/formatters';

interface CacheEntry {
  posts: RedditPost[];
  summary: SentimentSummary;
  timestamp: number;
}

export function useRedditPosts() {
  const [currentSubreddit, setCurrentSubreddit] = useState<string>('');
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sortBy, setSortBy] = useState<SortOption>('score');
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // In-memory session cache for fast tab/search switching
  const [cache] = useState<Map<string, CacheEntry>>(() => new Map());

  const searchSubreddit = useCallback(async (
    subredditInput: string,
    forceRefresh: boolean = false,
    overrideDemoMode?: boolean
  ) => {
    const cleanedSubreddit = normalizeSubredditName(subredditInput);
    const useDemo = overrideDemoMode !== undefined ? overrideDemoMode : isDemoMode;

    if (!cleanedSubreddit) {
      setError('Please enter a subreddit name.');
      return;
    }

    const cacheKey = `${cleanedSubreddit.toLowerCase()}_${useDemo ? 'demo' : 'live'}`;

    // Return cached result if available and fresh (< 5 mins) and not force refreshing
    const cached = cache.get(cacheKey);
    if (cached && !forceRefresh && (Date.now() - cached.timestamp < 5 * 60 * 1000)) {
      setCurrentSubreddit(cleanedSubreddit);
      setPosts(cached.posts);
      setError(null);
      setLastUpdated(cached.timestamp);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedPosts = await fetchSubredditHotPosts(cleanedSubreddit, useDemo);
      const summary = calculateSentimentSummary(fetchedPosts);

      const now = Date.now();
      cache.set(cacheKey, {
        posts: fetchedPosts,
        summary,
        timestamp: now
      });

      setCurrentSubreddit(cleanedSubreddit);
      setPosts(fetchedPosts);
      setLastUpdated(now);
    } catch (err: any) {
      setError(err.message || `Failed to load posts for r/${cleanedSubreddit}`);
    } finally {
      setLoading(false);
    }
  }, [cache, isDemoMode]);

  const toggleDemoMode = useCallback((newDemoState?: boolean) => {
    const nextState = newDemoState !== undefined ? newDemoState : !isDemoMode;
    setIsDemoMode(nextState);
    if (currentSubreddit) {
      searchSubreddit(currentSubreddit, true, nextState);
    }
  }, [isDemoMode, currentSubreddit, searchSubreddit]);

  // Overall sentiment summary calculation
  const summary: SentimentSummary = useMemo(() => {
    return calculateSentimentSummary(posts);
  }, [posts]);

  // Filter & sort posts client-side
  const filteredPosts: RedditPost[] = useMemo(() => {
    let result = [...posts];

    // Apply sentiment filter
    if (filter !== 'all') {
      result = result.filter(post => post.sentimentLabel === filter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'score') {
        return b.score - a.score;
      }
      if (sortBy === 'comments') {
        return b.comments - a.comments;
      }
      if (sortBy === 'sentiment') {
        return b.sentimentScore - a.sentimentScore;
      }
      if (sortBy === 'newest') {
        return b.createdAt - a.createdAt;
      }
      return 0;
    });

    return result;
  }, [posts, filter, sortBy]);

  return {
    currentSubreddit,
    posts,
    filteredPosts,
    summary,
    loading,
    error,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    lastUpdated,
    isDemoMode,
    toggleDemoMode,
    searchSubreddit
  };
}
