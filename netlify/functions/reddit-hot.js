// netlify/functions/reddit-hot.js

let cachedToken = null;

/**
 * Normalizes input string to a clean subreddit name (e.g. 'r/programming' -> 'programming')
 */
function normalizeSubreddit(input) {
  if (!input) return '';
  let cleaned = String(input).trim();
  cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?reddit\.com\/r\//i, '');
  cleaned = cleaned.replace(/^\/?r\//i, '');
  cleaned = cleaned.split('/')[0].split('?')[0];
  return cleaned.trim();
}

/**
 * Obtains or reuses an OAuth access token using client_credentials grant type
 */
async function getRedditToken(clientId, clientSecret, userAgent) {
  if (!clientId || !clientSecret) return null;

  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }

  try {
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': userAgent || 'TheSubredditVibeCheck/1.0.0'
      },
      body: 'grant_type=client_credentials'
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.access_token) {
        cachedToken = {
          token: data.access_token,
          expiresAt: Date.now() + (data.expires_in || 3600) * 1000
        };
        return cachedToken.token;
      }
    }
  } catch (e) {
    console.error('Failed to acquire Reddit access token:', e);
  }
  return null;
}

export async function handler(event, context) {
  // CORS Headers for API function
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle CORS preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const rawSubreddit = event.queryStringParameters?.subreddit || '';
  const subreddit = normalizeSubreddit(rawSubreddit);

  if (!subreddit) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Please specify a subreddit parameter (e.g. ?subreddit=programming).' })
    };
  }

  if (!/^[a-zA-Z0-9_]{2,21}$/.test(subreddit)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `"${subreddit}" is not a valid subreddit name format.` })
    };
  }

  const clientId = process.env.REDDIT_CLIENT_ID || process.env.VITE_REDDIT_CLIENT_ID || '';
  const clientSecret = process.env.REDDIT_CLIENT_SECRET || process.env.VITE_REDDIT_CLIENT_SECRET || '';
  const userAgent = process.env.REDDIT_USER_AGENT || 'TheSubredditVibeCheck/1.0.0 (by SportsOrca Assessment)';

  let fetchUrl = '';
  let requestHeaders = { 'User-Agent': userAgent };

  const token = await getRedditToken(clientId, clientSecret, userAgent);

  if (token) {
    fetchUrl = `https://oauth.reddit.com/r/${subreddit}/hot?limit=50&raw_json=1`;
    requestHeaders['Authorization'] = `Bearer ${token}`;
  } else if (clientId && clientSecret) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Reddit authentication failed. Check your client ID and secret credentials.' })
    };
  } else {
    // Unauthenticated fallback attempt
    fetchUrl = `https://www.reddit.com/r/${subreddit}/hot.json?limit=50&raw_json=1`;
  }

  try {
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: requestHeaders
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 401) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Reddit authentication is not configured correctly.' })
        };
      }
      if (status === 403) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: 'Reddit denied the API request. Check API access and credentials.' })
        };
      }
      if (status === 404) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: `That subreddit (r/${subreddit}) could not be found.` })
        };
      }
      if (status === 429) {
        return {
          statusCode: 429,
          headers,
          body: JSON.stringify({ error: 'Reddit rate limit reached. Please try again shortly.' })
        };
      }
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: `Reddit API returned HTTP error ${status}. Please try again.` })
      };
    }

    const data = await response.json();

    if (!data || !data.data || !Array.isArray(data.data.children)) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Received invalid post list structure from Reddit API.' })
      };
    }

    const posts = data.data.children
      .filter(child => child && child.kind === 't3' && child.data && child.data.title)
      .slice(0, 50)
      .map(child => {
        const item = child.data;
        const permalink = item.permalink
          ? (item.permalink.startsWith('http') ? item.permalink : `https://www.reddit.com${item.permalink}`)
          : `https://www.reddit.com/r/${subreddit}`;

        return {
          id: item.id || String(Math.random()),
          title: item.title.trim(),
          author: item.author && item.author !== '[deleted]' ? `u/${item.author}` : '[deleted]',
          score: typeof item.score === 'number' ? item.score : (item.ups || 0),
          comments: typeof item.num_comments === 'number' ? item.num_comments : 0,
          createdAt: item.created_utc || Math.floor(Date.now() / 1000),
          subreddit: item.subreddit || subreddit,
          permalink,
          url: item.url || permalink,
          thumbnail: item.thumbnail && item.thumbnail.startsWith('http') ? item.thumbnail : undefined,
          isNsfw: Boolean(item.over_18),
          isSelf: Boolean(item.is_self),
          upvoteRatio: item.upvote_ratio
        };
      });

    if (posts.length === 0) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: `r/${subreddit} exists but currently has no hot posts.` })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        subreddit,
        posts
      })
    };

  } catch (err) {
    console.error('Reddit API Netlify function error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Reddit API is temporarily unavailable. Please try again.' })
    };
  }
}
