import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { SummaryCards } from './components/SummaryCards';
import { SentimentChart } from './components/SentimentChart';
import { FilterBar } from './components/FilterBar';
import { PostList } from './components/PostList';
import { EmptyState } from './components/EmptyState';
import { LoadingState } from './components/LoadingState';
import { ErrorState } from './components/ErrorState';
import { useRedditPosts } from './hooks/useRedditPosts';
import { RefreshCw, Clock, Database, Zap } from 'lucide-react';
import { formatRelativeTime } from './utils/formatters';

export const App: React.FC = () => {
  const {
    currentSubreddit,
    posts,
    filteredPosts,
    summary,
    loading,
    error,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    lastUpdated,
    isDemoMode,
    toggleDemoMode,
    searchSubreddit
  } = useRedditPosts();

  useEffect(() => {
    searchSubreddit('programming');
  }, [searchSubreddit]);

  const handleSelectSubreddit = (sub: string) => {
    searchSubreddit(sub);
  };

  const handleRefresh = () => {
    if (currentSubreddit) {
      searchSubreddit(currentSubreddit, true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between">
      
      {/* Navigation Header */}
      <div>
        <Header isDemoMode={isDemoMode} onToggleDemoMode={() => toggleDemoMode()} />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* Explicit Demo Mode Banner (when active) */}
          {isDemoMode && (
            <div className="bg-purple-950/80 border border-purple-500/50 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-purple-950/40 animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-purple-900/80 text-purple-300">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-purple-200 flex items-center space-x-2">
                    <span>DEMO MODE ACTIVE — Sample Data Fixtures</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-[10px] text-purple-300 font-mono">Explicit Preview</span>
                  </h4>
                  <p className="text-xs text-purple-300/80 mt-0.5">
                    Displaying sample post fixtures. All title sentiment analysis is executed 100% client-side via AFINN-165 NLP.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggleDemoMode(false)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 shrink-0 shadow-md shadow-emerald-600/30"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Switch to Live API Mode</span>
              </button>
            </div>
          )}

          {/* Search Section */}
          <SearchBar
            onSearch={handleSelectSubreddit}
            loading={loading}
            currentSubreddit={currentSubreddit}
          />

          {/* Conditional Content States */}
          {loading ? (
            <LoadingState subreddit={currentSubreddit} />
          ) : error ? (
            <ErrorState
              error={error}
              onRetry={handleRefresh}
              onSelectExample={handleSelectSubreddit}
              onEnableDemoMode={() => toggleDemoMode(true)}
            />
          ) : !currentSubreddit || posts.length === 0 ? (
            <EmptyState onSelectExample={handleSelectSubreddit} />
          ) : (
            <div className="space-y-8 animate-fade-in">

              {/* Subreddit Header Bar & Manual Refresh */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-800/40 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${isDemoMode ? 'bg-purple-400' : 'bg-emerald-400'}`}></span>
                  <span className="text-sm font-semibold text-slate-200">
                    {isDemoMode ? 'Demo Vibe Check:' : 'Live Vibe Check:'} <span className="text-indigo-400 font-bold">r/{currentSubreddit}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-400">
                  {lastUpdated && (
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Updated {formatRelativeTime(Math.floor(lastUpdated / 1000))}</span>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* 1. Summary Cards */}
              <SummaryCards summary={summary} subreddit={currentSubreddit} />

              {/* 2. Sentiment Visualization & Overall Vibe Card */}
              <SentimentChart summary={summary} />

              {/* 3. Filtering & Sorting Controls */}
              <FilterBar
                filter={filter}
                setFilter={setFilter}
                sortBy={sortBy}
                setSortBy={setSortBy}
                summary={summary}
                showingCount={filteredPosts.length}
              />

              {/* 4. Posts List */}
              <PostList
                posts={filteredPosts}
                filter={filter}
                onClearFilter={() => setFilter('all')}
              />

            </div>
          )}

        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 mt-12 text-center text-xs text-slate-400 space-y-1">
        <p className="flex items-center justify-center space-x-1">
          <span>The Subreddit Vibe Check &bull; Full Stack Assessment for</span>
          <span className="text-indigo-400 font-semibold">SportsOrca</span>
        </p>
        <p className="text-[11px]">
          Client-side sentiment analysis powered by AFINN-165 NLP &bull; Supports Live Reddit OAuth API & Demo Mode
        </p>
      </footer>

    </div>
  );
};
