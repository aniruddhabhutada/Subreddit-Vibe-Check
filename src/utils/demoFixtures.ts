export interface RawDemoPost {
  id: string;
  title: string;
  author: string;
  score: number;
  comments: number;
  createdAt: number;
  subreddit: string;
  permalink: string;
  url: string;
  isNsfw?: boolean;
  isSelf?: boolean;
  upvoteRatio?: number;
}

const CURRENT_NOW = Math.floor(Date.now() / 1000);

export const DEMO_DATA_MAP: Record<string, RawDemoPost[]> = {
  programming: [
    {
      id: 'demo_p1',
      title: 'Rust 1.78.0 released with fantastic new memory safety features and performance improvements',
      author: 'u/rust_dev_official',
      score: 4820,
      comments: 342,
      createdAt: CURRENT_NOW - 7200,
      subreddit: 'programming',
      permalink: 'https://www.reddit.com/r/programming/comments/demo_p1',
      url: 'https://www.reddit.com/r/programming/comments/demo_p1',
      upvoteRatio: 0.96
    },
    {
      id: 'demo_p2',
      title: 'Why legacy spaghetti code creates huge security vulnerabilities and terrible developer burnout',
      author: 'u/senior_architect',
      score: 2150,
      comments: 512,
      createdAt: CURRENT_NOW - 14400,
      subreddit: 'programming',
      permalink: 'https://www.reddit.com/r/programming/comments/demo_p2',
      url: 'https://www.reddit.com/r/programming/comments/demo_p2',
      upvoteRatio: 0.91
    },
    {
      id: 'demo_p3',
      title: 'Understanding PostgreSQL indexing strategies: B-Trees, GiST, and GIN explained simply',
      author: 'u/db_wizard',
      score: 1890,
      comments: 98,
      createdAt: CURRENT_NOW - 21600,
      subreddit: 'programming',
      permalink: 'https://www.reddit.com/r/programming/comments/demo_p3',
      url: 'https://www.reddit.com/r/programming/comments/demo_p3',
      upvoteRatio: 0.98
    },
    {
      id: 'demo_p4',
      title: 'Frustrating API breaking changes in major framework update cause nightmare migration bugs',
      author: 'u/web_dev_coder',
      score: 1420,
      comments: 265,
      createdAt: CURRENT_NOW - 28800,
      subreddit: 'programming',
      permalink: 'https://www.reddit.com/r/programming/comments/demo_p4',
      url: 'https://www.reddit.com/r/programming/comments/demo_p4',
      upvoteRatio: 0.88
    },
    {
      id: 'demo_p5',
      title: 'Building a fast, scalable web crawler in Go: A complete step-by-step tutorial',
      author: 'u/gopher_master',
      score: 3100,
      comments: 145,
      createdAt: CURRENT_NOW - 36000,
      subreddit: 'programming',
      permalink: 'https://www.reddit.com/r/programming/comments/demo_p5',
      url: 'https://www.reddit.com/r/programming/comments/demo_p5',
      upvoteRatio: 0.97
    },
    {
      id: 'demo_p6',
      title: 'Garbage Collection algorithms compared: Generational ZGC vs Shenandoah vs Mark-Sweep',
      author: 'u/jvm_internals',
      score: 980,
      comments: 64,
      createdAt: CURRENT_NOW - 43200,
      subreddit: 'programming',
      permalink: 'https://www.reddit.com/r/programming/comments/demo_p6',
      url: 'https://www.reddit.com/r/programming/comments/demo_p6',
      upvoteRatio: 0.94
    },
    {
      id: 'demo_p7',
      title: 'Critical remote code execution flaw discovered in popular open-source JSON parser library',
      author: 'u/sec_researcher',
      score: 5200,
      comments: 610,
      createdAt: CURRENT_NOW - 50400,
      subreddit: 'programming',
      permalink: 'https://www.reddit.com/r/programming/comments/demo_p7',
      url: 'https://www.reddit.com/r/programming/comments/demo_p7',
      upvoteRatio: 0.95
    },
    {
      id: 'demo_p8',
      title: 'Clean architecture principles for modern TypeScript and React applications',
      author: 'u/frontend_craft',
      score: 2780,
      comments: 184,
      createdAt: CURRENT_NOW - 57600,
      subreddit: 'programming',
      permalink: 'https://www.reddit.com/r/programming/comments/demo_p8',
      url: 'https://www.reddit.com/r/programming/comments/demo_p8',
      upvoteRatio: 0.97
    }
  ],
  technology: [
    {
      id: 'demo_t1',
      title: 'Breakthrough in quantum computing chip efficiency promises major reduction in energy consumption',
      author: 'u/tech_insider',
      score: 8900,
      comments: 730,
      createdAt: CURRENT_NOW - 5400,
      subreddit: 'technology',
      permalink: 'https://www.reddit.com/r/technology/comments/demo_t1',
      url: 'https://www.reddit.com/r/technology/comments/demo_t1',
      upvoteRatio: 0.95
    },
    {
      id: 'demo_t2',
      title: 'EU passes strict new consumer right-to-repair legislation for smartphones and laptops',
      author: 'u/eu_policy_watch',
      score: 14200,
      comments: 1120,
      createdAt: CURRENT_NOW - 18000,
      subreddit: 'technology',
      permalink: 'https://www.reddit.com/r/technology/comments/demo_t2',
      url: 'https://www.reddit.com/r/technology/comments/demo_t2',
      upvoteRatio: 0.98
    },
    {
      id: 'demo_t3',
      title: 'Major telecom outage leaves millions without internet across three states',
      author: 'u/net_observer',
      score: 6400,
      comments: 890,
      createdAt: CURRENT_NOW - 32000,
      subreddit: 'technology',
      permalink: 'https://www.reddit.com/r/technology/comments/demo_t3',
      url: 'https://www.reddit.com/r/technology/comments/demo_t3',
      upvoteRatio: 0.92
    }
  ]
};

/**
 * Generates sample demo posts for a given subreddit
 */
export function getDemoPostsForSubreddit(subreddit: string): RawDemoPost[] {
  const normalized = subreddit.toLowerCase();
  if (DEMO_DATA_MAP[normalized]) {
    return DEMO_DATA_MAP[normalized];
  }

  // Generic sample posts fallback for any searched subreddit
  return [
    {
      id: `demo_${normalized}_1`,
      title: `Amazing community milestones achieved on r/${subreddit} with positive member growth!`,
      author: 'u/community_lead',
      score: 3200,
      comments: 210,
      createdAt: CURRENT_NOW - 3600,
      subreddit,
      permalink: `https://www.reddit.com/r/${subreddit}`,
      url: `https://www.reddit.com/r/${subreddit}`,
      upvoteRatio: 0.97
    },
    {
      id: `demo_${normalized}_2`,
      title: `Controversial changes proposed for r/${subreddit} guidelines spark heated debate`,
      author: 'u/mod_team',
      score: 1450,
      comments: 480,
      createdAt: CURRENT_NOW - 12000,
      subreddit,
      permalink: `https://www.reddit.com/r/${subreddit}`,
      url: `https://www.reddit.com/r/${subreddit}`,
      upvoteRatio: 0.84
    },
    {
      id: `demo_${normalized}_3`,
      title: `Weekly discussion thread and Q&A for r/${subreddit} enthusiasts`,
      author: 'u/auto_moderator',
      score: 890,
      comments: 130,
      createdAt: CURRENT_NOW - 25000,
      subreddit,
      permalink: `https://www.reddit.com/r/${subreddit}`,
      url: `https://www.reddit.com/r/${subreddit}`,
      upvoteRatio: 0.95
    },
    {
      id: `demo_${normalized}_4`,
      title: `Worst mistakes beginners make when getting started with r/${subreddit} topics`,
      author: 'u/veteran_guide',
      score: 2100,
      comments: 310,
      createdAt: CURRENT_NOW - 40000,
      subreddit,
      permalink: `https://www.reddit.com/r/${subreddit}`,
      url: `https://www.reddit.com/r/${subreddit}`,
      upvoteRatio: 0.91
    }
  ];
}
