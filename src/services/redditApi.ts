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
          'Content-Type': 'application/x-www-form-urlencoded'
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
    console.warn('OAuth token fetch failed, falling back to public endpoint strategies.', error);
  }

  return null;
}

/**
 * Helper to fetch JSON from a URL with timeout
 */
async function fetchJsonWithTimeout(url: string, headers: Record<string, string> = {}, timeoutMs = 8000): Promise<RawRedditListingResponse | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.kind === 'Listing' && data.data && Array.isArray(data.data.children)) {
        return data as RawRedditListingResponse;
      }
    }
  } catch (e) {
    // Ignore individual strategy errors and proceed to next fallback
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

  if (!/^[a-zA-Z0-9_]{2,21}$/.test(subreddit)) {
    throw new Error(`"${subreddit}" is not a valid subreddit name format. Subreddit names should contain 2-21 alphanumeric characters.`);
  }

  let responseData: RawRedditListingResponse | null = null;

  // Strategy 1: OAuth authenticated request if credentials are present
  const oauthToken = await getOAuthToken();
  if (oauthToken) {
    responseData = await fetchJsonWithTimeout(
      `https://oauth.reddit.com/r/${subreddit}/hot?limit=50&raw_json=1`,
      { 'Authorization': `Bearer ${oauthToken}` }
    );
  }

  // Strategy 2: Direct public Reddit endpoint (No unsafe User-Agent header in browser)
  if (!responseData) {
    responseData = await fetchJsonWithTimeout(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=50&raw_json=1`
    );
  }

  // Strategy 3: Old Reddit endpoint
  if (!responseData) {
    responseData = await fetchJsonWithTimeout(
      `https://old.reddit.com/r/${subreddit}/hot.json?limit=50&raw_json=1`
    );
  }

  // Strategy 4: Proxy route (/api/reddit-proxy/...)
  if (!responseData) {
    responseData = await fetchJsonWithTimeout(
      `/api/reddit-proxy/r/${subreddit}/hot.json?limit=50&raw_json=1`
    );
  }

  // Strategy 5: Public CORS proxy fallback
  if (!responseData) {
    const targetUrl = encodeURIComponent(`https://www.reddit.com/r/${subreddit}/hot.json?limit=50&raw_json=1`);
    responseData = await fetchJsonWithTimeout(`https://api.allorigins.win/raw?url=${targetUrl}`);
  }

  if (!responseData || !responseData.data || !Array.isArray(responseData.data.children)) {
    throw new Error(`Unable to fetch posts for r/${subreddit}. Subreddit may not exist, be private, or Reddit API rate limit was reached.`);
  }

  const children = responseData.data.children;

  if (children.length === 0) {
    throw new Error(`r/${subreddit} exists but currently has no hot posts.`);
  }

  // Transform and normalize raw Reddit API response into domain model
  const posts: RedditPost[] = children
    .filter(child => child && child.kind === 't3' && child.data && child.data.title)
    .slice(0, 50)
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
