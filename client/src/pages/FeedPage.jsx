import { useState, useEffect } from 'react';
import { RefreshCw, CheckCheck, SlidersHorizontal, Rss } from 'lucide-react';
import {
  useArticles,
  useArticleStats,
  useMarkAllRead,
  useTriggerRefresh,
} from '../hooks/useArticles';
import ArticleCard from '../components/feed/ArticleCard';
import CategoryFilter from '../components/feed/CategoryFilter';
import StatsBar from '../components/feed/StatsBar';
import FeedSkeleton from '../components/feed/FeedSkeleton';
import Pagination from '../components/ui/Pagination';

export default function FeedPage() {
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [category, unreadOnly, search]);

  const { data, isLoading, isFetching } = useArticles({ category, page, unreadOnly, search });
  const { data: stats, isLoading: statsLoading } = useArticleStats();
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllRead();
  const { mutate: triggerRefresh, isPending: refreshing } = useTriggerRefresh();

  const articles = data?.articles || [];
  const pagination = data?.pagination;

  // Search: debounce by 400ms
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleMarkAllRead = () => {
    markAllRead(category === 'all' ? undefined : category);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats bar */}
      <StatsBar stats={stats} isLoading={statsLoading} />

      {/* Controls row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CategoryFilter
          active={category}
          onChange={handleCategoryChange}
          stats={stats}
        />

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Unread filter toggle */}
          <button
            onClick={() => setUnreadOnly((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-all
              ${unreadOnly
                ? 'border-purple/50 bg-purple-subtle text-purple-bright'
                : 'border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
              }`}
          >
            <SlidersHorizontal size={13} />
            Unread only
          </button>

          {/* Mark all read */}
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all disabled:opacity-40"
          >
            <CheckCheck size={13} />
            Mark all read
          </button>

          {/* Manual refresh */}
          <button
            onClick={() => triggerRefresh()}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-elevated transition-all disabled:opacity-40"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search articles by title, source, or keyword..."
          className="input-base text-sm pr-4"
        />
        {isFetching && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-purple/30 border-t-purple rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Feed grid */}
      {isLoading ? (
        <FeedSkeleton count={8} />
      ) : articles.length === 0 ? (
        <EmptyState search={search} unreadOnly={unreadOnly} category={category} />
      ) : (
        <>
          {/* Result count */}
          <p className="text-text-muted text-xs font-mono">
            {pagination?.total?.toLocaleString()} article{pagination?.total !== 1 ? 's' : ''}
            {search && ` matching "${search}"`}
            {unreadOnly && ' · unread only'}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={pagination?.totalPages || 1}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

function EmptyState({ search, unreadOnly, category }) {
  return (
    <div className="card p-16 flex flex-col items-center justify-center text-center">
      <div className="w-14 h-14 rounded-xl bg-purple-subtle border border-purple/30 flex items-center justify-center mb-4">
        <Rss size={24} className="text-purple-glow" />
      </div>
      <h3 className="text-text-primary font-medium">No articles found</h3>
      <p className="text-text-muted text-sm mt-2 max-w-sm">
        {search
          ? `No results for "${search}". Try a different search term.`
          : unreadOnly
          ? 'All caught up — no unread articles in this category.'
          : 'Feeds are loading. Articles will appear here once the first refresh completes.'}
      </p>
    </div>
  );
}
