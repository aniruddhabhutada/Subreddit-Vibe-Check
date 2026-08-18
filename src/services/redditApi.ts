import axios from 'axios';
import { RawRedditListingResponse, RedditPost } from '../types/reddit';
import { analyzeTitleSentiment } from '../utils/sentiment';
import { normalizeSubredditName } from '../utils/formatters';

const CLIENT_ID = import.meta.env.VITE_REDDIT_CLIENT_ID || '';
const CLIENT_SECRET = import.meta.env.VITE_REDDIT_CLIENT_SECRET || '';

let cachedOAuthToken: { token: string; expiresAt: number } | null = null;

/**
 * Obtains an OAuth access token from Reddit if credentials are provided in environment variables
 */
async function getOAuthToken(): Promise<string | null> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return null;
  }

  // Use cached token if valid for at least another 60 seconds
  if (cachedOAuthToken && Date.now() < cachedOAuthToken.expiresAt - 60000) {
    return cachedOAuthToken.token;
  }

  try {
    const authHeader = 'Basic ' + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'web:subreddit-vibe-check:v1.0.0 (by /u/vibecheckapp)'
        },
        timeout: 8000
      }
    );

    if (response.data && response.data.access_token) {
      cachedOAuthToken = {
        token: response.data.access_token,
        expiresAt: Date.now() + (response.data.expires_in || 3600) * 1000
      };
      return cachedOAuthToken.token;
    }
  } catch (error) {
    console.warn('OAuth token fetch failed, falling back to public endpoint strategy.', error);
  }

  return null;
}

/**
 * Fetches 50 Hot posts from Reddit for a given subreddit
 */
export async function fetchSubredditHotPosts(rawSubredditInput: string): Promise<RedditPost[]> {
  const subreddit = normalizeSubredditName(rawSubredditInput);

  if (!subreddit) {
    throw new Error('Please enter a valid subreddit name.');
  }

  // Validate subreddit format (alphanumeric and underscores, 3-21 chars)
  if (!/^[a-zA-Z0-9_]{2,21}$/.test(subreddit)) {
    throw new Error(`"${subreddit}" is not a valid subreddit name format. Subreddit names should contain 2-21 alphanumeric characters.`);
  }

  let responseData: RawRedditListingResponse | null = null;
  let fetchError: Error | null = null;

  // Strategy 1: OAuth authenticated request if credentials are present
  const oauthToken = await getOAuthToken();
  if (oauthToken) {
    try {
      const res = await axios.get<RawRedditListingResponse>(
        `https://oauth.reddit.com/r/${subreddit}/hot`,
        {
          params: { limit: 50, raw_json: 1 },
          headers: {
            'Authorization': `Bearer ${oauthToken}`,
            'User-Agent': 'web:subreddit-vibe-check:v1.0.0 (by /u/vibecheckapp)'
          },
          timeout: 10000
        }
      );
      responseData = res.data;
    } catch (err: any) {
      fetchError = err;
    }
  }

  // Strategy 2: Direct public endpoint request
  if (!responseData) {
    try {
      const res = await axios.get<RawRedditListingResponse>(
        `https://www.reddit.com/r/${subreddit}/hot.json`,
        {
          params: { limit: 50, raw_json: 1 },
          headers: {
            'User-Agent': 'web:subreddit-vibe-check:v1.0.0 (by /u/vibecheckapp)'
          },
          timeout: 10000
        }
      );
      responseData = res.data;
    } catch (err: any) {
      fetchError = err;
    }
  }

  // Strategy 3: Vite Dev Proxy fallback if CORS/network blocked direct fetch
  if (!responseData && import.meta.env.DEV) {
    try {
      const res = await axios.get<RawRedditListingResponse>(
        `/api/reddit-proxy/r/${subreddit}/hot.json`,
        {
          params: { limit: 50, raw_json: 1 },
          timeout: 10000
        }
      );
      responseData = res.data;
    } catch (err: any) {
      fetchError = err;
    }
  }

  // Handle detailed HTTP / Reddit API error responses
  if (!responseData && fetchError) {
    const errObj = fetchError as any;
    if (errObj.response) {
      const status = errObj.response.status;
      if (status === 404) {
        throw new Error(`Subreddit "r/${subreddit}" does not exist or was deleted.`);
      } else if (status === 403) {
        throw new Error(`Subreddit "r/${subreddit}" is private, banned, or restricted.`);
      } else if (status === 429) {
        throw new Error(`Reddit API rate limit exceeded. Please wait a few moments and try again.`);
      } else {
        throw new Error(`Reddit API error (${status}): Unable to fetch posts for r/${subreddit}.`);
      }
    } else if (errObj.request) {
      throw new Error(`Network error: Unable to reach Reddit API. Please check your internet connection.`);
    } else {
      throw new Error(fetchError.message || `An unknown error occurred while fetching r/${subreddit}.`);
    }
  }

  if (!responseData || !responseData.data || !Array.isArray(responseData.data.children)) {
    throw new Error(`Invalid response received from Reddit API for r/${subreddit}.`);
  }

  const children = responseData.data.children;

  if (children.length === 0) {
    throw new Error(`r/${subreddit} exists but currently has no hot posts.`);
  }

  // Transform and normalize raw Reddit API response into domain model
  const posts: RedditPost[] = children
    .filter(child => child && child.kind === 't3' && child.data && child.data.title)
    .slice(0, 50) // Ensure max 50 posts
    .map(child => {
      const data = child.data;
      const title = data.title.trim();
      
      // Perform client-side sentiment analysis on title
      const sentiment = analyzeTitleSentiment(title);

      const permalink = data.permalink
        ? (data.permalink.startsWith('http') ? data.permalink : `https://www.reddit.com${data.permalink}`)
        : `https://www.reddit.com/r/${subreddit}`;

      return {
        id: data.id || Math.random().toString(36).slice(2),
        title,
        author: data.author && data.author !== '[deleted]' ? `u/${data.author}` : '[deleted]',
        score: typeof data.score === 'number' ? data.score : (data.ups || 0),
        comments: typeof data.num_comments === 'number' ? data.num_comments : 0,
        createdAt: data.created_utc || Math.floor(Date.now() / 1000),
        subreddit: data.subreddit || subreddit,
        permalink,
        url: data.url || permalink,
        thumbnail: data.thumbnail && data.thumbnail.startsWith('http') ? data.thumbnail : undefined,
        isNsfw: Boolean(data.over_18),
        isSelf: Boolean(data.is_self),
        upvoteRatio: data.upvote_ratio,
        sentimentScore: sentiment.score,
        sentimentComparative: sentiment.comparative,
        sentimentLabel: sentiment.label,
        positiveWords: sentiment.positiveWords,
        negativeWords: sentiment.negativeWords
      };
    });

  return posts;
}
