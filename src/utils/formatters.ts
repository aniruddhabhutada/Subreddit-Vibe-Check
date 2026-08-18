/**
 * Normalizes input string to a clean subreddit name (e.g. 'r/programming' or 'https://reddit.com/r/programming' -> 'programming')
 */
export function normalizeSubredditName(input: string): string {
  if (!input) return '';
  let cleaned = input.trim();
  
  // Strip full URL prefix if pasted
  cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?reddit\.com\/r\//i, '');
  // Strip leading r/ or /r/
  cleaned = cleaned.replace(/^\/?r\//i, '');
  // Strip trailing slashes or query parameters
  cleaned = cleaned.split('/')[0].split('?')[0];

  return cleaned.trim();
}

/**
 * Formats large numbers into readable k/m strings (e.g., 14500 -> 14.5k)
 */
export function formatCompactNumber(num: number): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  if (Math.abs(num) >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (Math.abs(num) >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toLocaleString();
}

/**
 * Formats unix timestamp into a relative time string (e.g. "2 hours ago")
 */
export function formatRelativeTime(timestampSeconds: number): string {
  if (!timestampSeconds) return 'recently';
  const now = Math.floor(Date.now() / 1000);
  const diffInSeconds = now - timestampSeconds;

  if (diffInSeconds < 60) {
    return 'just now';
  }
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}d ago`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}mo ago`;
  }
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}
