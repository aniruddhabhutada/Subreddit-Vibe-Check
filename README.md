# 🌊 The Subreddit Vibe Check

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Netlify Functions](https://img.shields.io/badge/Netlify-Functions-00C7B7.svg)](https://www.netlify.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Full Stack Development Internship Assessment Project for SportsOrca**  
> *Real-time client-side sentiment analysis and visual vibe dashboard for Reddit subreddits.*

---

## 1. Project Overview

**The Subreddit Vibe Check** is a full-stack web application designed to analyze the community mood and sentiment of any public subreddit in real time.

By retrieving the **top 50 Hot posts** via a secure Netlify Serverless API Function (`/.netlify/functions/reddit-hot`), the application performs **100% client-side natural language sentiment analysis** on post titles using the AFINN-165 lexicon. It categorizes titles into **Positive**, **Neutral**, and **Negative** sentiment, calculates aggregate scores, and presents the results through interactive visual cards, doughnut charts, and multi-field filtering/sorting.

---

## 2. Features

- 🔍 **Subreddit Search & Normalization**: Search any public subreddit with automatic normalization (accepts `programming`, `r/programming`, or `https://reddit.com/r/programming`).
- ⚡ **50 Hot Posts Retrieval**: Fetches actual, un-faked top 50 hot posts from Reddit's API via serverless backend function.
- 🧠 **100% Client-Side Sentiment Analysis**: Title sentiment analysis runs entirely inside the user's browser using `sentiment` (AFINN-165 algorithm).
- 📊 **Visual Dashboard**:
  - **Summary Metrics**: Total Posts, Positive Count, Neutral Count, Negative Count, Average Sentiment Score, Average Post Upvotes, and Total Comments.
  - **Interactive Chart**: Recharts Doughnut chart showing sentiment distribution ratios.
  - **Overall Vibe Indicator**: Calculates overall community tone (*Very Positive*, *Positive*, *Neutral*, *Negative*, *Very Negative*).
- 🎛️ **Filtering & Sorting**:
  - Filter posts by sentiment (*All*, *Positive*, *Neutral*, *Negative*).
  - Sort posts by *Score (Upvotes)*, *Comments Count*, *Sentiment Score*, and *Newest*.
- 🎨 **Responsive & Accessible UI**: Dark-mode visual theme built with Tailwind CSS, smooth animations, semantic HTML, and high contrast.
- 🛡️ **Robust UX & Specific HTTP Error Handling**:
  - **400**: Invalid subreddit format.
  - **401**: Reddit authentication is not configured correctly.
  - **403**: Reddit denied the API request. Check API access and credentials.
  - **404**: That subreddit could not be found.
  - **429**: Reddit rate limit reached. Please try again shortly.
  - **500**: Reddit is temporarily unavailable. Please try again.

---

## 3. Tech Stack

- **Frontend Framework**: React 18 (TypeScript)
- **Build Tool**: Vite 5
- **Backend API**: Netlify Serverless Functions (Node.js)
- **Styling**: Tailwind CSS v3 + Lucide React Icons
- **Sentiment Analysis**: `sentiment` (AFINN-165 Natural Language Processing library)
- **Data Visualization**: Recharts (Doughnut/Pie Chart)

---

## 4. Architecture

```text
  ┌─────────────────────────────┐
  │         Browser UI          │ (User enters "programming" or "r/sports")
  └──────────────┬──────────────┘
                 │
                 ▼
  ┌─────────────────────────────┐
  │ Netlify Serverless Function │ (/.netlify/functions/reddit-hot?subreddit=programming)
  └──────────────┬──────────────┘
                 │ (Server-side Reddit OAuth authorization via REDDIT_CLIENT_ID / SECRET)
                 ▼
  ┌─────────────────────────────┐
  │     Reddit OAuth API        │ (https://oauth.reddit.com/r/programming/hot?limit=50)
  └──────────────┬──────────────┘
                 │ (Returns top 50 hot posts JSON)
                 ▼
  ┌─────────────────────────────┐
  │     Browser Client NLP      │ 🧠 Executes 100% in BROWSER via sentiment JS package
  └──────────────┬──────────────┘ (Analyzes titles -> Positive / Neutral / Negative)
                 │
                 ▼
  ┌─────────────────────────────┐
  │ Visual Dashboard & Charts   │ (Renders summary cards, Recharts chart & filtered post list)
  └─────────────────────────────┘
```

---

## 5. Reddit API Setup & Netlify Configuration

To configure Reddit API authentication on Netlify:

1. Log in to [Reddit](https://www.reddit.com).
2. Navigate to [Reddit App Preferences](https://www.reddit.com/prefs/apps).
3. Click **"create another app..."** at the bottom.
4. Fill in:
   - **Name**: `Subreddit Vibe Check`
   - **App type**: Select `script` or `web app`.
   - **Redirect URI**: `https://subredddit.netlify.app`
5. Copy your **Client ID** (string under the app name) and **Client Secret**.
6. In **Netlify**: Go to **Site Configuration** &rarr; **Environment Variables** &rarr; **Add a Variable**:
   - `REDDIT_CLIENT_ID` = `<your_client_id>`
   - `REDDIT_CLIENT_SECRET` = `<your_client_secret>`
   - `REDDIT_USER_AGENT` = `TheSubredditVibeCheck/1.0.0 (by SportsOrca Assessment)`

---

## 6. Environment Variables

Create a `.env` file in the root directory for local development (refer to `.env.example`):

```bash
# Server-side Reddit OAuth Credentials (DO NOT commit real keys to Git)
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USER_AGENT=TheSubredditVibeCheck/1.0.0 (by SportsOrca Assessment)
```

*Note: Secrets are kept strictly server-side and never exposed to client-side bundles or frontend JavaScript.*

---

## 7. Local Installation & Development

Ensure Node.js (v18+) is installed.

```bash
# Clone repository
git clone https://github.com/aniruddhabhutada/Subreddit-Vibe-Check.git

# Navigate into project directory
cd Subreddit-Vibe-Check

# Install dependencies
npm install

# Start Vite local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The Vite dev server includes built-in middleware to emulate Netlify functions locally!

---

## 8. Production Build

To test and compile the production build locally:

```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

The output bundle will be compiled into the `dist/` directory.

---

## 9. Deployment on Netlify

1. Push your repository to GitHub.
2. Import the project into [Netlify](https://app.netlify.com).
3. Netlify automatically reads [`netlify.toml`](file:///c:/Users/aniru/Downloads/ass/netlify.toml):
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Functions Directory**: `netlify/functions`
4. Add environment variables (`REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, `REDDIT_USER_AGENT`) in Netlify Site Configuration.
5. Click **Deploy**.

---

## 10. Design Decisions

- **Why Netlify Serverless Function?** To avoid CORS issues, protect Reddit API Client Secrets from being exposed to browser bundles, and comply with Reddit's current API authentication policies.
- **Why Client-Side Sentiment Analysis?** Performing sentiment analysis strictly in the browser guarantees fast computation without backend latency, server costs, or privacy concerns.
- **Why AFINN-165 (`sentiment` package)?** The `sentiment` library uses the AFINN-165 wordlist with negation and valence boosting. It is lightweight (~12KB), reliable, fast, and does not require heavy machine learning models.

---

## 11. Limitations

- **Reddit API Rate Limits**: Reddit OAuth rate limits permit 60–100 requests per minute.
- **AFINN Lexicon Scope**: The AFINN-165 lexicon analyzes English words effectively. Sarcasm, complex slang, or non-English titles may result in neutral scores.

---

## 📜 License

MIT License &copy; 2026. Built for SportsOrca Assessment.
