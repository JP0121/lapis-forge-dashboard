import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

const STATUS_OPTIONS = ['watching', 'active', 'paused', 'retired'];
const CATEGORY_OPTIONS = ['depin', 'ai', 'crypto', 'infra'];
const STATUS_COLORS = { active: 'text-status-green', watching: 'text-status-blue', paused: 'text-status-orange', retired: 'text-text-muted' };

const EMPTY = {
  name: '', category: 'depin', status: 'watching', description: '',
  website: '', docsUrl: '', dashboardUrl: '', tokenSymbol: '', tokenId: '',
  keywords: '', notes: '', nodeCount: 0, hostingPlatform: '',
  roi: { invested: 0, earned: 0, currency: 'USD', notes: '' },
};

export default function ProjectForm({ isOpen, onClose, onSubmit, initialData, isLoading }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (initialData) {
      setForm({
        ...EMPTY, ...initialData,
        keywords: (initialData.keywords || []).join(', '),
        roi: { ...EMPTY.roi, ...(initialData.roi || {}) },
      });
    } else {
      setForm(EMPTY);
    }
  }, [initialData, isOpen]);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const setRoi = (field, value) => setForm((f) => ({ ...f, roi: { ...f.roi, [field]: value } }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
      nodeCount: Number(form.nodeCount) || 0,
      roi: { ...form.roi, invested: Number(form.roi.invested) || 0, earned: Number(form.roi.earned) || 0 },
    };
    onSubmit(payload);
  };

  const inputCls = 'input-base text-sm';
  const labelCls = 'block text-text-muted text-xs font-mono uppercase tracking-wide mb-1.5';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Project' : 'Add Project'} size="lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelCls}>Project Name *</label>
            <input required className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. AIOZ Network" />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select className={inputCls} value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select className={inputCls} value={form.status} onChange={(e) => set('status', e.target.value)}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Description</label>
            <textarea className={inputCls} rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Short description of the project" />
          </div>
          <div>
            <label className={labelCls}>Website</label>
            <input className={inputCls} value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className={labelCls}>Dashboard URL</label>
            <input className={inputCls} value={form.dashboardUrl} onChange={(e) => set('dashboardUrl', e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className={labelCls}>Token Symbol</label>
            <input className={inputCls} value={form.tokenSymbol} onChange={(e) => set('tokenSymbol', e.target.value.toUpperCase())} placeholder="e.g. AIOZ" />
          </div>
          <div>
            <label className={labelCls}>CoinGecko ID</label>
            <input className={inputCls} value={form.tokenId} onChange={(e) => set('tokenId', e.target.value)} placeholder="e.g. aioz-network" />
          </div>
          <div>
            <label className={labelCls}>Hosting Platform</label>
            <input className={inputCls} value={form.hostingPlatform} onChange={(e) => set('hostingPlatform', e.target.value)} placeholder="e.g. Oracle Cloud" />
          </div>
          <div>
            <label className={labelCls}>Node Count</label>
            <input type="number" min="0" className={inputCls} value={form.nodeCount} onChange={(e) => set('nodeCount', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>Keywords (comma separated) — used to match articles</label>
            <input className={inputCls} value={form.keywords} onChange={(e) => set('keywords', e.target.value)} placeholder="aioz, aioz network, aioz node" />
          </div>
        </div>

        <div className="border-t border-border-subtle pt-4">
          <p className="text-text-secondary text-xs font-mono uppercase tracking-wide mb-3">ROI Tracking</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelCls}>Invested (USD)</label>
              <input type="number" min="0" step="0.01" className={inputCls} value={form.roi.invested} onChange={(e) => setRoi('invested', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Earned (USD)</label>
              <input type="number" min="0" step="0.01" className={inputCls} value={form.roi.earned} onChange={(e) => setRoi('earned', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Net</label>
              <div className={`input-base text-sm font-mono ${(form.roi.earned - form.roi.invested) >= 0 ? 'text-status-green' : 'text-status-red'}`}>
                ${((Number(form.roi.earned) || 0) - (Number(form.roi.invested) || 0)).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mt-3">
            <label className={labelCls}>ROI Notes</label>
            <input className={inputCls} value={form.roi.notes} onChange={(e) => setRoi('notes', e.target.value)} placeholder="e.g. Earning ~0.5 AIOZ/day per node" />
          </div>
        </div>

        <div className="border-t border-border-subtle pt-4">
          <label className={labelCls}>Personal Notes</label>
          <textarea className={inputCls} rows={3} value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Any notes about this project..." />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost text-sm">Cancel</button>
          <button type="submit" disabled={isLoading} className="btn-primary text-sm">
            {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Add Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
