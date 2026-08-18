import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SentimentSummary, OverallVibe } from '../types/reddit';
import { Smile, Meh, Frown, Sparkles, Activity } from 'lucide-react';

interface SentimentChartProps {
  summary: SentimentSummary;
}

const COLORS = {
  positive: '#10b981', // emerald-500
  neutral: '#6366f1',  // indigo-500
  negative: '#f43f5e', // rose-500
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ summary }) => {
  const chartData = [
    { name: 'Positive', value: summary.positiveCount, color: COLORS.positive },
    { name: 'Neutral', value: summary.neutralCount, color: COLORS.neutral },
    { name: 'Negative', value: summary.negativeCount, color: COLORS.negative },
  ];

  const getVibeBadgeDetails = (vibe: OverallVibe) => {
    switch (vibe) {
      case 'Very Positive':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: <Smile className="w-5 h-5 text-emerald-400" />,
          desc: 'Overwhelmingly positive tone across hot post titles.'
        };
      case 'Positive':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          icon: <Smile className="w-5 h-5 text-emerald-400" />,
          desc: 'Generally cheerful and constructive discussions.'
        };
      case 'Neutral':
        return {
          bg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
          icon: <Meh className="w-5 h-5 text-indigo-400" />,
          desc: 'Balanced or informative informational headlines.'
        };
      case 'Negative':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
          icon: <Frown className="w-5 h-5 text-rose-400" />,
          desc: 'Critical or cautious post titles dominant.'
        };
      case 'Very Negative':
        return {
          bg: 'bg-rose-500/20 border-rose-500/40 text-rose-400',
          icon: <Frown className="w-5 h-5 text-rose-400" />,
          desc: 'Highly contentious or frustrated post titles.'
        };
    }
  };

  const vibeStyle = getVibeBadgeDetails(summary.overallVibe);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

      {/* Doughnut Chart Card */}
      <div className="lg:col-span-2 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
              Sentiment Distribution
            </h3>
          </div>
          <span className="text-xs text-slate-400">Total Analyzed: {summary.totalPosts} Titles</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center py-4">
          {/* Recharts Pie Chart */}
          <div className="h-52 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1e293b" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Stat inside Doughnut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-white">
                {summary.totalPosts > 0
                  ? `${Math.round((summary.positiveCount / summary.totalPosts) * 100)}%`
                  : '0%'}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Positive Ratio</span>
            </div>
          </div>

          {/* Breakdown Legend Bars */}
          <div className="space-y-3">
            {/* Positive Row */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Positive Titles
                </span>
                <span className="text-slate-200">
                  {summary.positiveCount} ({summary.totalPosts > 0 ? Math.round((summary.positiveCount / summary.totalPosts) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary.totalPosts > 0 ? (summary.positiveCount / summary.totalPosts) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Neutral Row */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-indigo-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  Neutral Titles
                </span>
                <span className="text-slate-200">
                  {summary.neutralCount} ({summary.totalPosts > 0 ? Math.round((summary.neutralCount / summary.totalPosts) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary.totalPosts > 0 ? (summary.neutralCount / summary.totalPosts) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Negative Row */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-rose-400 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Negative Titles
                </span>
                <span className="text-slate-200">
                  {summary.negativeCount} ({summary.totalPosts > 0 ? Math.round((summary.negativeCount / summary.totalPosts) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary.totalPosts > 0 ? (summary.negativeCount / summary.totalPosts) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Overall Vibe Status Indicator Card */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-700/50">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
              Overall Vibe Analysis
            </h3>
          </div>

          <div className="mt-4 flex flex-col items-center text-center py-3">
            <div className={`p-4 rounded-2xl border ${vibeStyle.bg} mb-3 shadow-inner`}>
              {vibeStyle.icon}
            </div>

            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">
              Subreddit Vibe Status
            </span>

            <h4 className="text-2xl font-black text-white tracking-wide">
              {summary.overallVibe}
            </h4>

            <p className="text-xs text-slate-300 mt-2 max-w-xs leading-relaxed">
              {vibeStyle.desc}
            </p>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-700/40 text-center">
          <span className="text-[11px] text-slate-400">
            Calculated via AFINN-165 comparative score (Avg: {summary.averageSentimentScore})
          </span>
        </div>
      </div>

    </div>
  );
};
