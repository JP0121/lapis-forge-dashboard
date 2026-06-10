import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark, Tag, Search, X, Edit2, Check } from 'lucide-react';
import { bookmarksService } from '../services/bookmarks';
import { articlesService } from '../services/articles';
import ArticleCard from '../components/feed/ArticleCard';
import EmptyState from '../components/ui/EmptyState';
import Pagination from '../components/ui/Pagination';
import Modal from '../components/ui/Modal';
import toast from 'react-hot-toast';
import { timeAgo } from '../utils/time';

export default function BookmarksPage() {
  const [activeTag, setActiveTag] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [metaTarget, setMetaTarget] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['bookmarks', { tag: activeTag, search, page }],
    queryFn: () => bookmarksService.getAll({ tag: activeTag, search, page }),
    staleTime: 60 * 1000,
  });

  const articles = data?.articles || [];
  const allTags = data?.allTags || [];
  const pagination = data?.pagination;

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    const v = e.target.value;
    const t = setTimeout(() => { setSearch(v); setPage(1); }, 400);
    return () => clearTimeout(t);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-text-muted text-xs font-mono uppercase tracking-wide">Saved Articles</p>
          <p className="text-2xl font-bold font-mono text-purple-glow mt-1">{pagination?.total ?? '—'}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-muted text-xs font-mono uppercase tracking-wide">Tags Used</p>
          <p className="text-2xl font-bold font-mono text-status-blue mt-1">{allTags.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-muted text-xs font-mono uppercase tracking-wide">Current Filter</p>
          <p className="text-sm font-mono text-text-primary mt-1 truncate">{activeTag || search || 'All'}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
        <input type="text" value={searchInput} onChange={handleSearch}
          placeholder="Search bookmarks by title, tag, or notes..."
          className="input-base text-sm pl-10" />
        {searchInput && (
          <button onClick={() => { setSearchInput(''); setSearch(''); }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-text-muted text-xs font-mono">Tags:</span>
          <button onClick={() => setActiveTag('')}
            className={`text-xs px-2.5 py-1 rounded-full border transition-all ${!activeTag ? 'border-purple/50 bg-purple-subtle text-purple-bright' : 'border-border-subtle text-text-secondary hover:border-border hover:bg-bg-elevated'}`}>
            All
          </button>
          {allTags.map((tag) => (
            <button key={tag} onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all ${activeTag === tag ? 'border-purple/50 bg-purple-subtle text-purple-bright' : 'border-border-subtle text-text-secondary hover:border-border hover:bg-bg-elevated'}`}>
              <Tag size={10} />{tag}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-40 animate-pulse" />)}
        </div>
      ) : articles.length === 0 ? (
        <EmptyState icon={Bookmark} title="No bookmarks yet"
          description="Save articles from the Feed Hub using the bookmark button on any article card." />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {articles.map((article) => (
              <div key={article._id} className="relative group">
                <ArticleCard article={article} />
                <div className="flex items-center gap-2 mt-1 px-1">
                  {article.meta?.tags?.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs text-purple-bright bg-purple-subtle px-2 py-0.5 rounded font-mono">
                      <Tag size={9} />{tag}
                    </span>
                  ))}
                  {article.meta?.notes && (
                    <span className="text-text-muted text-xs italic truncate">"{article.meta.notes}"</span>
                  )}
                  <button onClick={() => setMetaTarget(article)}
                    className="ml-auto text-xs text-text-muted hover:text-purple transition-colors flex items-center gap-1">
                    <Edit2 size={10} /> Edit tags
                  </button>
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={pagination?.totalPages || 1} onPageChange={setPage} />
        </>
      )}

      <MetaEditModal article={metaTarget} onClose={() => setMetaTarget(null)} />
    </div>
  );
}

function MetaEditModal({ article, onClose }) {
  const qc = useQueryClient();
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  useState(() => {
    if (article) {
      setTags((article.meta?.tags || []).join(', '));
      setNotes(article.meta?.notes || '');
    }
  }, [article]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => bookmarksService.upsertMeta(article._id, {
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      notes: notes.trim(),
    }),
    onSuccess: () => {
      toast.success('Saved');
      qc.invalidateQueries({ queryKey: ['bookmarks'] });
      onClose();
    },
  });

  return (
    <Modal isOpen={!!article} onClose={onClose} title="Edit Bookmark" size="sm">
      <div className="p-6 space-y-4">
        <p className="text-text-secondary text-sm line-clamp-2">{article?.title}</p>
        <div>
          <label className="block text-text-muted text-xs font-mono uppercase tracking-wide mb-1.5">Tags (comma separated)</label>
          <input className="input-base text-sm" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="depin, node, research" />
        </div>
        <div>
          <label className="block text-text-muted text-xs font-mono uppercase tracking-wide mb-1.5">Notes</label>
          <textarea className="input-base text-sm" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Why you saved this..." />
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-ghost text-sm">Cancel</button>
          <button onClick={() => mutate()} disabled={isPending} className="btn-primary text-sm flex items-center gap-2">
            <Check size={14} /> {isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
