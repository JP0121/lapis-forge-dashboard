import { ExternalLink, Bookmark, BookmarkCheck, Circle, CheckCircle2 } from 'lucide-react';
import { timeAgo } from '../../utils/time';
import { useMarkRead, useToggleBookmark } from '../../hooks/useArticles';

const CATEGORY_STYLES = {
  depin: { label: 'DePIN', className: 'tag-depin' },
  ai:    { label: 'AI',    className: 'tag-ai'    },
  crypto:{ label: 'Crypto',className: 'tag-crypto'},
  tech:  { label: 'Tech',  className: 'tag-tech'  },
};

export default function ArticleCard({ article }) {
  const { mutate: markRead } = useMarkRead();
  const { mutate: toggleBookmark, isPending: bookmarkPending } = useToggleBookmark();

  const cat = CATEGORY_STYLES[article.category] || { label: article.category, className: 'tag-tech' };
  const isRead = article.isRead;

  const handleReadClick = (e) => {
    e.preventDefault();
    markRead({ id: article._id, isRead: !isRead });
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    toggleBookmark(article._id);
  };

  const handleTitleClick = () => {
    if (!isRead) markRead({ id: article._id, isRead: true });
  };

  return (
    <article
      className={`card group relative flex flex-col gap-3 p-4 transition-all duration-200
        hover:border-border hover:shadow-purple-sm
        border-l-2 ${isRead ? 'border-l-border-subtle opacity-60 hover:opacity-100' : 'border-l-purple'}
      `}
    >
      {/* Top row: category tag + source + time */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={cat.className}>{cat.label}</span>
        <span className="text-text-muted text-xs font-mono">{article.source}</span>
        <span className="text-text-muted text-xs ml-auto font-mono flex-shrink-0">
          {timeAgo(article.publishedAt)}
        </span>
      </div>

      {/* Title */}
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleTitleClick}
        className={`text-sm font-medium leading-snug transition-colors duration-150
          ${isRead ? 'text-text-secondary' : 'text-text-primary'}
          hover:text-purple-glow group-hover:text-purple-glow
        `}
      >
        {article.title}
      </a>

      {/* Description */}
      {article.description && (
        <p className="text-text-muted text-xs leading-relaxed line-clamp-2">
          {article.description}
        </p>
      )}

      {/* Tags */}
      {article.tags?.length > 0 && (
        <div className="flex gap-1 flex-wrap">
          {article.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-text-muted text-xs font-mono bg-bg-elevated px-1.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions row */}
      <div className="flex items-center gap-1 mt-auto pt-1 border-t border-border-subtle/50">
        {/* Mark read toggle */}
        <button
          onClick={handleReadClick}
          className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-all duration-150
            ${isRead
              ? 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
              : 'text-status-green hover:bg-green-950/40'
            }`}
          title={isRead ? 'Mark unread' : 'Mark read'}
        >
          {isRead
            ? <CheckCircle2 size={13} />
            : <Circle size={13} />
          }
          <span>{isRead ? 'Read' : 'Mark read'}</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={handleBookmark}
          disabled={bookmarkPending}
          className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded transition-all duration-150
            ${article.isBookmarked
              ? 'text-purple-glow hover:bg-purple-subtle'
              : 'text-text-muted hover:text-text-secondary hover:bg-bg-elevated'
            }`}
          title={article.isBookmarked ? 'Remove bookmark' : 'Bookmark'}
        >
          {article.isBookmarked ? <BookmarkCheck size={13} /> : <Bookmark size={13} />}
          <span>{article.isBookmarked ? 'Saved' : 'Save'}</span>
        </button>

        {/* Open link */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleTitleClick}
          className="ml-auto flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary px-2 py-1 rounded hover:bg-bg-elevated transition-all"
        >
          <ExternalLink size={12} />
          <span>Open</span>
        </a>
      </div>
    </article>
  );
}
