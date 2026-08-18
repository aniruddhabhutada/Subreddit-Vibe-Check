# 🌊 The Subreddit Vibe Check

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-purple.svg)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Full Stack Development Internship Assessment Project for SportsOrca**  
> *Real-time client-side sentiment analysis and visual vibe dashboard for Reddit subreddits.*

---

## 1. Project Overview

**The Subreddit Vibe Check** is a web application designed to analyze the community mood and sentiment of any public subreddit in real time.

By retrieving the **top 50 Hot posts** directly from Reddit's API, the application performs **100% client-side natural language sentiment analysis** on post titles using the AFINN-165 lexicon. It categorizes titles into **Positive**, **Neutral**, and **Negative** sentiment, calculates aggregate scores, and presents the results through interactive visual cards, doughnut charts, and multi-field filtering/sorting.

---

## 2. Features

- 🔍 **Subreddit Search & Normalization**: Search any public subreddit with automatic normalization (accepts `programming`, `r/programming`, or `https://reddit.com/r/programming`).
- ⚡ **50 Hot Posts Retrieval**: Fetches actual, un-faked top 50 hot posts from Reddit's API.
- 🧠 **100% Client-Side Sentiment Analysis**: Title sentiment analysis runs entirely inside the user's browser using `sentiment` (AFINN-165 algorithm).
- 📊 **Visual Dashboard**:
  - **Summary Metrics**: Total Posts, Positive Count, Neutral Count, Negative Count, Average Sentiment Score, Average Post Upvotes, and Total Comments.
  - **Interactive Chart**: Recharts Doughnut chart showing sentiment distribution ratios.
  - **Overall Vibe Indicator**: Calculates overall community tone (*Very Positive*, *Positive*, *Neutral*, *Negative*, *Very Negative*).
- 🎛️ **Filtering & Sorting**:
  - Filter posts by sentiment (*All*, *Positive*, *Neutral*, *Negative*).
  - Sort posts by *Score (Upvotes)*, *Comments Count*, *Sentiment Score*, and *Newest*.
- 🎨 **Responsive & Accessible UI**: Dark-mode visual theme built with Tailwind CSS, smooth animations, semantic HTML, and high contrast.
- 🛡️ **Robust UX States**:
  - **Initial State**: Helpful guidance and clickable popular community pills.
  - **Loading State**: Animated skeleton loaders and fetching progress text.
  - **Error State**: Human-friendly error messages for invalid/deleted subreddits, rate limits, or network failures.

---

## 3. Tech Stack

- **Frontend Framework**: React 18 (TypeScript)
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS v3 + Lucide React Icons
- **Sentiment Analysis**: `sentiment` (AFINN-165 Natural Language Processing library)
- **Data Visualization**: Recharts (Doughnut/Pie Chart)
- **HTTP Client**: Axios with fallback proxy handling

---

## 4. Architecture

```text
  ┌──────────────────┐
  │   User Input     │ (e.g. "programming" or "r/sports")
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ Subreddit Normal │ (Strips URL/slashes, validates 2-21 alphanumeric chars)
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────┐
  │ Reddit API Layer │ (OAuth credentials or public JSON API)
  └────────┬─────────┘
           │ (JSON response containing top 50 hot posts)
           ▼
  ┌──────────────────┐
  │ Data Transformer │ (Normalizes raw post fields into clean frontend model)
  └────────┬─────────┘
           │
           ▼
  ┌──────────────────────────────┐
  │ Client-Side Sentiment Engine │ 🧠 Executes in BROWSER via sentiment JS package
  └────────┬─────────────────────┘ (Analyzes titles -> Positive / Neutral / Negative)
           │
           ▼
  ┌──────────────────────────────┐
  │   Visual Dashboard & Charts  │ (Renders summary cards, Recharts chart & filtered post list)
  └──────────────────────────────┘
```

---

## 5. Reddit API Setup

The application works out-of-the-box using Reddit's public API endpoints (`https://www.reddit.com/r/{subreddit}/hot.json?limit=50`).

If higher API rate limits or authenticated access are required:

1. Log in to [Reddit](https://www.reddit.com).
2. Navigate to [Reddit App Preferences](https://www.reddit.com/prefs/apps).
3. Click **"create another app..."** at the bottom.
4. Fill in:
   - **Name**: `Subreddit Vibe Check`
   - **App type**: Select `script` or `web app`.
   - **Redirect URI**: `http://localhost:3000`
5. Note down your **Client ID** (string under the app name) and **Client Secret**.
6. Add these credentials to your `.env` or `.env.local` file.

---

## 6. Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```bash
# Optional Reddit OAuth Credentials
VITE_REDDIT_CLIENT_ID=your_reddit_client_id_here
VITE_REDDIT_CLIENT_SECRET=your_reddit_client_secret_here
```

*Note: Never commit `.env` or `.env.local` to source control.*

---

## 7. Local Installation

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

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## 9. Deployment

### Deploying to Vercel (Recommended)

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Vercel automatically detects Vite framework settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variables (`VITE_REDDIT_CLIENT_ID`, `VITE_REDDIT_CLIENT_SECRET`) in Vercel project settings if using OAuth credentials.
5. Click **Deploy**.

---

## 10. Design Decisions

- **Why React + Vite + TypeScript?** Vite offers instant HMR development speed, while TypeScript provides strict compile-time type safety for complex API objects and sentiment output structures.
- **Why Client-Side Sentiment Analysis?** Performing sentiment analysis strictly in the browser guarantees fast computation without backend latency, server costs, or privacy concerns.
- **Why AFINN-165 (`sentiment` package)?** The `sentiment` library uses the AFINN-165 wordlist with negation and valence boosting. It is lightweight (~12KB), reliable, fast, and does not require heavy machine learning models.
- **Why Multi-Tier API Fallback?** Direct browser fetches, Vite dev proxies, and optional OAuth authorization ensure the application remains functional across local environments, production hosts, and CORS configurations.

---

## 11. Limitations

- **Public API Rate Limits**: Unauthenticated public Reddit endpoints allow up to 10-30 requests per minute per IP. Supplying Reddit OAuth credentials increases limits.
- **AFINN Lexicon Scope**: The AFINN-165 lexicon analyzes English words effectively. Sarcasm, complex slang, or non-English titles may result in neutral scores.

---

## 12. Screenshots

### Dashboard Overview
*(Insert screenshot of dashboard metrics and Recharts doughnut chart)*

### Sentiment Filtering & Sorting
*(Insert screenshot of positive/negative filtered posts)*

### Mobile Layout
*(Insert screenshot of mobile responsive view at 390px)*

---

## 📜 License

MIT License &copy; 2026. Built for SportsOrca Assessment.
