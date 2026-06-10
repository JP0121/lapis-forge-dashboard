import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BarChart2, TrendingUp, Sparkles, RefreshCw, Calendar, Database, Zap } from 'lucide-react';
import { analyticsService } from '../services/analytics';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const CATEGORY_COLORS = { depin: '#7c3aed', ai: '#3b82f6', crypto: '#f59e0b', tech: '#10b981' };

export default function AnalyticsPage() {
  const { data: overview, isLoading: overviewLoading } = useQuery({
    queryKey: ['analyticsOverview'],
    queryFn: analyticsService.getOverview,
    staleTime: 5 * 60 * 1000,
  });
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['analyticsTrending'],
    queryFn: analyticsService.getTrending,
    staleTime: 10 * 60 * 1000,
  });
  const { mutate: generateDigest, isPending: generating, data: digestData } = useMutation({
    mutationFn: analyticsService.generateDigest,
  });

  const dailyData = (overview?.dailyVolume || []).map((d) => ({ date: d._id.slice(5), count: d.count }));
  const categoryData = (overview?.byCategory || []).map((c) => ({ name: c._id?.toUpperCase(), count: c.count, color: CATEGORY_COLORS[c._id] || '#7c3aed' }));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-bg-elevated border border-border-subtle rounded px-3 py-2 text-xs">
        <p className="text-text-primary font-mono">{payload[0].value} articles</p>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Articles', value: overview?.total, icon: Database, color: 'text-purple-glow' },
          { label: 'Last 7 Days', value: overview?.last7Days, icon: Calendar, color: 'text-status-blue' },
          { label: 'Last 30 Days', value: overview?.last30Days, icon: TrendingUp, color: 'text-status-green' },
          { label: 'Top Sources', value: overview?.topSources?.length, icon: Zap, color: 'text-status-orange' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <Icon size={20} className={`${color} opacity-80 flex-shrink-0`} />
            <div>
              <p className={`text-xl font-bold font-mono ${color}`}>
                {overviewLoading ? <span className="inline-block w-10 h-5 bg-bg-elevated rounded animate-pulse" /> : (value ?? '—')}
              </p>
              <p className="text-text-muted text-xs">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Daily volume chart */}
        <div className="card p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-4 flex items-center gap-2">
            <BarChart2 size={15} className="text-purple" /> Articles per Day (14d)
          </h3>
          {overviewLoading ? (
            <div className="h-40 bg-bg-elevated rounded animate-pulse" />
          ) : dailyData.length === 0 ? (
            <p className="text-text-muted text-sm text-center py-8">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fill: '#8888aa', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#8888aa', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,58,237,0.1)' }} />
                <Bar dataKey="count" radius={[3, 3, 0, 0]} fill="#7c3aed" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* By category */}
        <div className="card p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-4">Articles by Category</h3>
          {overviewLoading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-8 bg-bg-elevated rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              {categoryData.map(({ name, count, color }) => {
                const total = categoryData.reduce((s, c) => s + c.count, 0);
                const pct = total ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-text-secondary text-xs font-mono">{name}</span>
                      <span className="text-text-muted text-xs font-mono">{count} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Trending keywords */}
        <div className="card p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={15} className="text-purple" /> Trending Keywords (7d)
          </h3>
          {trendingLoading ? (
            <div className="h-40 bg-bg-elevated rounded animate-pulse" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {(trending?.trending || []).slice(0, 24).map(({ word, count, topCategory }) => (
                <span key={word}
                  className="text-xs font-mono px-2.5 py-1 rounded-full border transition-all"
                  style={{
                    borderColor: (CATEGORY_COLORS[topCategory] || '#7c3aed') + '40',
                    backgroundColor: (CATEGORY_COLORS[topCategory] || '#7c3aed') + '15',
                    color: CATEGORY_COLORS[topCategory] || '#a855f7',
                    fontSize: Math.min(14, 10 + count * 0.4) + 'px',
                  }}>
                  {word} <span className="opacity-60">{count}</span>
                </span>
              ))}
              {(!trending?.trending?.length) && <p className="text-text-muted text-sm">Not enough data yet. Trending keywords appear after feeds populate.</p>}
            </div>
          )}
        </div>

        {/* Top sources */}
        <div className="card p-5">
          <h3 className="text-text-primary font-semibold text-sm mb-4">Top Sources</h3>
          {overviewLoading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-6 bg-bg-elevated rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-2">
              {(overview?.topSources || []).map(({ _id, count }, i) => (
                <div key={_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-text-muted text-xs font-mono w-4">{i + 1}</span>
                    <span className="text-text-secondary text-sm">{_id}</span>
                  </div>
                  <span className="text-text-muted text-xs font-mono">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Digest */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-text-primary font-semibold text-sm flex items-center gap-2">
            <Sparkles size={15} className="text-purple" /> AI Weekly Digest
          </h3>
          <button onClick={() => generateDigest()} disabled={generating}
            className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50">
            <RefreshCw size={13} className={generating ? 'animate-spin' : ''} />
            {generating ? 'Generating...' : 'Generate Digest'}
          </button>
        </div>

        {!digestData && !generating && (
          <div className="text-center py-8">
            <Sparkles size={28} className="text-purple mx-auto mb-3 opacity-50" />
            <p className="text-text-muted text-sm">Click "Generate Digest" to get an AI-powered summary of the past week's news, tailored for DePIN operators.</p>
            <p className="text-text-muted text-xs mt-2">Requires <code className="font-mono bg-bg-elevated px-1 rounded">ANTHROPIC_API_KEY</code> to be set.</p>
          </div>
        )}

        {generating && (
          <div className="flex items-center gap-3 py-8 justify-center">
            <div className="w-5 h-5 border-2 border-purple/30 border-t-purple rounded-full animate-spin" />
            <p className="text-text-muted text-sm">Analyzing last 7 days of articles...</p>
          </div>
        )}

        {digestData?.digest && (
          <div className="bg-bg-elevated rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-purple-bright text-xs font-mono">Generated {new Date(digestData.generatedAt).toLocaleString()}</span>
              <span className="text-text-muted text-xs font-mono">{digestData.articleCount} articles analyzed</span>
            </div>
            <div className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {digestData.digest}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
