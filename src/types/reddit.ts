export interface RawRedditPostData {
  id: string;
  name: string;
  title: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  subreddit: string;
  permalink: string;
  url: string;
  thumbnail?: string;
  over_18?: boolean;
  is_self?: boolean;
  stickied?: boolean;
  ups?: number;
  upvote_ratio?: number;
}

export interface RawRedditChild {
  kind: string;
  data: RawRedditPostData;
}

export interface RawRedditListingResponse {
  kind: string;
  data: {
    after: string | null;
    before: string | null;
    dist: number;
    children: RawRedditChild[];
  };
  error?: number;
  message?: string;
}

export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export interface RedditPost {
  id: string;
  title: string;
  author: string;
  score: number;
  comments: number;
  createdAt: number; // Unix timestamp in seconds
  subreddit: string;
  permalink: string;
  url: string;
  thumbnail?: string;
  isNsfw: boolean;
  isSelf: boolean;
  upvoteRatio?: number;
  sentimentScore: number;
  sentimentComparative: number;
  sentimentLabel: SentimentLabel;
  positiveWords: string[];
  negativeWords: string[];
}

export type OverallVibe = 'Very Positive' | 'Positive' | 'Neutral' | 'Negative' | 'Very Negative';

export interface SentimentSummary {
  totalPosts: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  averageSentimentScore: number;
  averagePostScore: number;
  totalComments: number;
  overallVibe: OverallVibe;
}

export type SortOption = 'score' | 'comments' | 'sentiment' | 'newest';
export type FilterOption = 'all' | 'positive' | 'neutral' | 'negative';
