import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, RefreshCw } from 'lucide-react';
import { useTriggerRefresh, useArticleStats } from '../../hooks/useArticles';

const pageTitles = {
  '/feed':      { title: 'Feed Hub',    subtitle: 'Latest news across all categories' },
  '/projects':  { title: 'Projects',    subtitle: 'DePIN & node infrastructure tracker' },
  '/watchlist': { title: 'Watchlist',   subtitle: 'Keyword alerts and price notifications' },
  '/bookmarks': { title: 'Bookmarks',   subtitle: 'Saved articles and research board' },
  '/analytics': { title: 'Analytics',   subtitle: 'Insights, trends, and digests' },
};

export default function Header() {
  const location = useLocation();
  const page = pageTitles[location.pathname] || { title: 'Dashboard', subtitle: '' };
  const { mutate: triggerRefresh, isPending: refreshing } = useTriggerRefresh();
  const { data: stats } = useArticleStats();

  const hasAlerts = (stats?.unread || 0) > 0;

  return (
    <header className="h-16 bg-bg-surface/80 backdrop-blur-sm border-b border-border-subtle flex items-center justify-between px-6 sticky top-0 z-10">
      <div>
        <h2 className="text-text-primary font-semibold text-base leading-none">{page.title}</h2>
        <p className="text-text-muted text-xs mt-0.5">{page.subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Refresh */}
        <button
          onClick={() => triggerRefresh()}
          disabled={refreshing}
          title="Refresh feeds"
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all disabled:opacity-40"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
        </button>

        {/* Notification bell with unread badge */}
        <button className="relative p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all">
          <Bell size={16} />
          {hasAlerts && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple animate-pulse-slow" />
          )}
        </button>
      </div>
    </header>
  );
}
