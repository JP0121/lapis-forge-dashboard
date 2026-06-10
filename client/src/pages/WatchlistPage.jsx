import { useState } from 'react';
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, XCircle, ExternalLink, Tag } from 'lucide-react';
import { useAlerts, useCreateAlert, useUpdateAlert, useDeleteAlert, useClearMatches } from '../hooks/useAlerts';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { timeAgo } from '../utils/time';

export default function WatchlistPage() {
  const { data, isLoading } = useAlerts();
  const { mutate: create, isPending: creating } = useCreateAlert();
  const { mutate: update } = useUpdateAlert();
  const { mutate: remove } = useDeleteAlert();
  const { mutate: clearMatches } = useClearMatches();

  const [showForm, setShowForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [expandedAlert, setExpandedAlert] = useState(null);

  const alerts = data?.alerts || [];
  const totalHits = alerts.reduce((sum, a) => sum + (a.triggerCount || 0), 0);

  const handleCreate = (payload) => {
    create(payload, { onSuccess: () => setShowForm(false) });
  };

  const toggleEnabled = (alert) => {
    update({ id: alert._id, enabled: !alert.enabled });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4">
          <p className="text-text-muted text-xs font-mono uppercase tracking-wide">Total Alerts</p>
          <p className="text-2xl font-bold font-mono text-purple-glow mt-1">{alerts.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-muted text-xs font-mono uppercase tracking-wide">Active</p>
          <p className="text-2xl font-bold font-mono text-status-green mt-1">{alerts.filter(a => a.enabled).length}</p>
        </div>
        <div className="card p-4">
          <p className="text-text-muted text-xs font-mono uppercase tracking-wide">Total Hits</p>
          <p className="text-2xl font-bold font-mono text-status-orange mt-1">{totalHits}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={15} /> New Alert
        </button>
      </div>

      {/* Alerts list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="card h-20 animate-pulse" />)}
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState icon={Bell} title="No alerts yet"
          description="Create keyword alerts to get notified when matching articles appear in your feeds."
          action={<button onClick={() => setShowForm(true)} className="btn-primary text-sm flex items-center gap-2"><Plus size={14} /> Create first alert</button>}
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert._id} className={`card p-4 transition-all duration-200 ${alert.enabled ? 'border-l-2 border-l-purple' : 'border-l-2 border-l-border-subtle opacity-60'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag size={13} className="text-purple flex-shrink-0" />
                    <span className="text-text-primary font-medium text-sm">{alert.name}</span>
                    {alert.triggerCount > 0 && (
                      <span className="bg-purple-subtle text-purple-bright text-xs font-mono px-2 py-0.5 rounded-full">
                        {alert.triggerCount} hits
                      </span>
                    )}
                  </div>
                  <p className="text-text-muted text-xs font-mono ml-5">
                    keyword: <span className="text-purple-bright">"{alert.keyword}"</span>
                    {alert.lastTriggeredAt && (
                      <span className="ml-3 text-text-muted">last hit {timeAgo(alert.lastTriggeredAt)}</span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {alert.recentMatches?.length > 0 && (
                    <button onClick={() => setExpandedAlert(expandedAlert === alert._id ? null : alert._id)}
                      className="text-xs text-purple hover:text-purple-glow px-2 py-1 rounded hover:bg-purple-subtle transition-all">
                      {expandedAlert === alert._id ? 'Hide' : 'View'} matches
                    </button>
                  )}
                  <button onClick={() => toggleEnabled(alert)}
                    className={`p-1.5 rounded transition-all ${alert.enabled ? 'text-status-green hover:bg-green-950/30' : 'text-text-muted hover:bg-bg-elevated'}`}
                    title={alert.enabled ? 'Disable alert' : 'Enable alert'}>
                    {alert.enabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  </button>
                  {alert.recentMatches?.length > 0 && (
                    <button onClick={() => clearMatches(alert._id)}
                      className="p-1.5 rounded text-text-muted hover:text-status-orange hover:bg-orange-950/30 transition-all" title="Clear matches">
                      <XCircle size={15} />
                    </button>
                  )}
                  <button onClick={() => setDeleteTarget(alert)}
                    className="p-1.5 rounded text-text-muted hover:text-status-red hover:bg-red-950/30 transition-all">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Expanded matches */}
              {expandedAlert === alert._id && alert.recentMatches?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border-subtle space-y-2">
                  {alert.recentMatches.slice().reverse().map((match, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-text-muted text-xs font-mono flex-shrink-0 mt-0.5">{timeAgo(match.matchedAt)}</span>
                      <a href={match.url} target="_blank" rel="noopener noreferrer"
                        className="text-text-secondary text-xs hover:text-purple-glow transition-colors flex items-center gap-1 flex-1 min-w-0">
                        <span className="truncate">{match.title}</span>
                        <ExternalLink size={10} className="flex-shrink-0" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AlertForm isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={handleCreate} isLoading={creating} />

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget._id)}
        title="Delete Alert"
        message={`Delete the alert "${deleteTarget?.name}"?`}
      />
    </div>
  );
}

function AlertForm({ isOpen, onClose, onSubmit, isLoading }) {
  const [name, setName] = useState('');
  const [keyword, setKeyword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !keyword.trim()) return;
    onSubmit({ name: name.trim(), keyword: keyword.trim(), type: 'keyword', enabled: true });
    setName(''); setKeyword('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Keyword Alert" size="sm">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-text-muted text-xs font-mono uppercase tracking-wide mb-1.5">Alert Name</label>
          <input required className="input-base text-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Titan Network Updates" />
        </div>
        <div>
          <label className="block text-text-muted text-xs font-mono uppercase tracking-wide mb-1.5">Keyword</label>
          <input required className="input-base text-sm" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. titan network" />
          <p className="text-text-muted text-xs mt-1.5">Matches article titles and descriptions (case-insensitive)</p>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost text-sm">Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-primary text-sm">
            {isLoading ? 'Creating...' : 'Create Alert'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
