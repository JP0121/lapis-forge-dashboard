import { Layers, Brain, TrendingUp, Cpu, Inbox } from 'lucide-react';

const STATS = [
  {
    key: 'unread',
    label: 'Unread',
    icon: Inbox,
    color: 'text-purple-glow',
    getValue: (s) => s?.unread ?? '—',
  },
  {
    key: 'depin',
    label: 'DePIN',
    icon: Layers,
    color: 'text-purple-bright',
    getValue: (s) => s?.categories?.depin?.unread ?? '—',
  },
  {
    key: 'ai',
    label: 'AI',
    icon: Brain,
    color: 'text-status-blue',
    getValue: (s) => s?.categories?.ai?.unread ?? '—',
  },
  {
    key: 'crypto',
    label: 'Crypto',
    icon: TrendingUp,
    color: 'text-status-orange',
    getValue: (s) => s?.categories?.crypto?.unread ?? '—',
  },
  {
    key: 'tech',
    label: 'Tech',
    icon: Cpu,
    color: 'text-status-green',
    getValue: (s) => s?.categories?.tech?.unread ?? '—',
  },
];

export default function StatsBar({ stats, isLoading }) {
  return (
    <div className="grid grid-cols-5 gap-3">
      {STATS.map(({ key, label, icon: Icon, color, getValue }) => (
        <div key={key} className="card p-3 flex items-center gap-3">
          <div className={`${color} opacity-80`}>
            <Icon size={18} />
          </div>
          <div>
            <p className={`text-xl font-bold font-mono leading-none ${color}`}>
              {isLoading ? (
                <span className="inline-block w-6 h-5 bg-bg-elevated rounded animate-pulse" />
              ) : (
                getValue(stats)
              )}
            </p>
            <p className="text-text-muted text-xs mt-0.5">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
