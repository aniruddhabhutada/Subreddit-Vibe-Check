import Sentiment from 'sentiment';
import { RedditPost, SentimentSummary, OverallVibe, SentimentLabel } from '../types/reddit';

const sentimentInstance = new Sentiment();

export interface SingleSentimentResult {
  score: number;
  comparative: number;
  label: SentimentLabel;
  positiveWords: string[];
  negativeWords: string[];
}

/**
 * Analyzes a text title client-side using AFINN-165 sentiment lexicon
 */
export function analyzeTitleSentiment(title: string): SingleSentimentResult {
  if (!title || typeof title !== 'string') {
    return {
      score: 0,
      comparative: 0,
      label: 'neutral',
      positiveWords: [],
      negativeWords: []
    };
  }

  const result = sentimentInstance.analyze(title);
  const score = result.score;
  const comparative = result.comparative;

  let label: SentimentLabel = 'neutral';
  if (score > 0) {
    label = 'positive';
  } else if (score < 0) {
    label = 'negative';
  }

  return {
    score,
    comparative,
    label,
    positiveWords: result.positive || [],
    negativeWords: result.negative || []
  };
}

/**
 * Calculates overall sentiment metrics and overall vibe for a list of posts
 */
export function calculateSentimentSummary(posts: RedditPost[]): SentimentSummary {
  if (posts.length === 0) {
    return {
      totalPosts: 0,
      positiveCount: 0,
      neutralCount: 0,
      negativeCount: 0,
      averageSentimentScore: 0,
      averagePostScore: 0,
      totalComments: 0,
      overallVibe: 'Neutral'
    };
  }

  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let totalSentimentScore = 0;
  let totalUpvotes = 0;
  let totalComments = 0;

  posts.forEach((post) => {
    if (post.sentimentLabel === 'positive') positiveCount++;
    else if (post.sentimentLabel === 'negative') negativeCount++;
    else neutralCount++;

    totalSentimentScore += post.sentimentScore;
    totalUpvotes += post.score;
    totalComments += post.comments;
  });

  const totalPosts = posts.length;
  const averageSentimentScore = Number((totalSentimentScore / totalPosts).toFixed(2));
  const averagePostScore = Math.round(totalUpvotes / totalPosts);

  let overallVibe: OverallVibe = 'Neutral';

  // Overall vibe calculation based on average score and ratio
  if (averageSentimentScore > 1.2) {
    overallVibe = 'Very Positive';
  } else if (averageSentimentScore > 0.15) {
    overallVibe = 'Positive';
  } else if (averageSentimentScore < -1.2) {
    overallVibe = 'Very Negative';
  } else if (averageSentimentScore < -0.15) {
    overallVibe = 'Negative';
  } else {
    overallVibe = 'Neutral';
  }

  return {
    totalPosts,
    positiveCount,
    neutralCount,
    negativeCount,
    averageSentimentScore,
    averagePostScore,
    totalComments,
    overallVibe
  };
}
