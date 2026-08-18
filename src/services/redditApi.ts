import { RedditPost } from '../types/reddit';
import { analyzeTitleSentiment } from '../utils/sentiment';
import { normalizeSubredditName } from '../utils/formatters';

interface ApiPostItem {
  id: string;
  title: string;
  author: string;
  score: number;
  comments: number;
  createdAt: number;
  subreddit: string;
  permalink: string;
  url: string;
  thumbnail?: string;
  isNsfw?: boolean;
  isSelf?: boolean;
  upvoteRatio?: number;
}

interface ApiResponsePayload {
  subreddit: string;
  posts: ApiPostItem[];
  error?: string;
}

/**
 * Fetches Hot posts for a given subreddit from the backend Netlify Serverless API endpoint
 * and calculates client-side sentiment analysis for every post title.
 */
export async function fetchSubredditHotPosts(rawSubredditInput: string): Promise<RedditPost[]> {
  const subreddit = normalizeSubredditName(rawSubredditInput);

  if (!subreddit) {
    throw new Error('Please enter a valid subreddit name.');
  }

  if (!/^[a-zA-Z0-9_]{2,21}$/.test(subreddit)) {
    throw new Error(`"${subreddit}" is not a valid subreddit name format. Subreddit names should contain 2-21 alphanumeric characters.`);
  }

  // Primary API endpoint: Netlify Function
  const apiUrl = `/.netlify/functions/reddit-hot?subreddit=${encodeURIComponent(subreddit)}`;

  let response: Response;
  try {
    response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
  } catch (netErr) {
    throw new Error('Network error: Unable to reach API server. Please check your internet connection.');
  }

  // Handle specific status codes with human-friendly messages as requested
  if (!response.ok) {
    let errMessage = '';
    try {
      const errData = await response.json();
      if (errData && errData.error) {
        errMessage = errData.error;
      }
    } catch (e) {
      // Ignore JSON parse failure for error body
    }

    if (!errMessage) {
      switch (response.status) {
        case 400:
          errMessage = `"${subreddit}" is an invalid subreddit name.`;
          break;
        case 401:
          errMessage = 'Reddit authentication is not configured correctly.';
          break;
        case 403:
          errMessage = 'Reddit denied the API request. Check API access and credentials.';
          break;
        case 404:
          errMessage = `That subreddit (r/${subreddit}) could not be found.`;
          break;
        case 429:
          errMessage = 'Reddit rate limit reached. Please try again shortly.';
          break;
        case 500:
        default:
          errMessage = 'Reddit is temporarily unavailable. Please try again.';
          break;
      }
    }

    throw new Error(errMessage);
  }

  const payload: ApiResponsePayload = await response.json();

  if (!payload || !Array.isArray(payload.posts)) {
    throw new Error('Received invalid data format from Reddit API endpoint.');
  }

  if (payload.posts.length === 0) {
    throw new Error(`r/${subreddit} exists but currently has no hot posts.`);
  }

  // Process posts and perform CLIENT-SIDE sentiment analysis on every title
  const posts: RedditPost[] = payload.posts.slice(0, 50).map((item) => {
    const title = (item.title || '').trim();

    // 100% Client-Side Sentiment Analysis using 'sentiment' AFINN-165 package
    const sentiment = analyzeTitleSentiment(title);

    return {
      id: item.id || String(Math.random()),
      title,
      author: item.author || '[deleted]',
      score: typeof item.score === 'number' ? item.score : 0,
      comments: typeof item.comments === 'number' ? item.comments : 0,
      createdAt: item.createdAt || Math.floor(Date.now() / 1000),
      subreddit: item.subreddit || subreddit,
      permalink: item.permalink || `https://www.reddit.com/r/${subreddit}`,
      url: item.url || item.permalink || `https://www.reddit.com/r/${subreddit}`,
      thumbnail: item.thumbnail,
      isNsfw: Boolean(item.isNsfw),
      isSelf: Boolean(item.isSelf),
      upvoteRatio: item.upvoteRatio,
      sentimentScore: sentiment.score,
      sentimentComparative: sentiment.comparative,
      sentimentLabel: sentiment.label,
      positiveWords: sentiment.positiveWords,
      negativeWords: sentiment.negativeWords
    };
  });

  return posts;
}
