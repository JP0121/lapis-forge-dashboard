const CATEGORIES = [
  { value: 'all',    label: 'All' },
  { value: 'depin',  label: 'DePIN' },
  { value: 'ai',     label: 'AI' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'tech',   label: 'Tech' },
];

const ACTIVE_STYLES = {
  all:    'bg-purple text-white border-purple',
  depin:  'bg-purple-subtle text-purple-bright border-purple/50',
  ai:     'bg-blue-950/80 text-status-blue border-status-blue/50',
  crypto: 'bg-orange-950/80 text-status-orange border-status-orange/50',
  tech:   'bg-green-950/80 text-status-green border-status-green/50',
};

export default function CategoryFilter({ active, onChange, stats }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {CATEGORIES.map(({ value, label }) => {
        const isActive = active === value;
        const unread = value === 'all'
          ? stats?.unread
          : stats?.categories?.[value]?.unread;

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border font-medium transition-all duration-150
              ${isActive
                ? ACTIVE_STYLES[value]
                : 'border-border-subtle text-text-secondary hover:text-text-primary hover:border-border hover:bg-bg-elevated'
              }`}
          >
            {label}
            {unread > 0 && (
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded-full
                ${isActive ? 'bg-white/20' : 'bg-bg-elevated text-text-muted'}`}>
                {unread > 99 ? '99+' : unread}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
