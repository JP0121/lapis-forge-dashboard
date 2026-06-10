import { ExternalLink, Edit2, Trash2, Server, TrendingUp, TrendingDown, Newspaper } from 'lucide-react';

const STATUS_STYLES = {
  active:   'bg-green-950/50 text-status-green border-status-green/30',
  watching: 'bg-blue-950/50 text-status-blue border-status-blue/30',
  paused:   'bg-orange-950/50 text-status-orange border-status-orange/30',
  retired:  'bg-bg-elevated text-text-muted border-border-subtle',
};
const CATEGORY_STYLES = {
  depin:  'tag-depin', ai: 'tag-ai', crypto: 'tag-crypto', infra: 'tag-tech',
};

export default function ProjectCard({ project, onEdit, onDelete, onViewArticles }) {
  const net = (project.roi?.earned || 0) - (project.roi?.invested || 0);
  const isProfit = net >= 0;

  return (
    <div className="card p-5 flex flex-col gap-4 hover:border-border hover:shadow-purple-sm transition-all duration-200 border-l-2 border-l-purple/40">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={CATEGORY_STYLES[project.category] || 'tag-tech'}>{project.category?.toUpperCase()}</span>
            <span className={`text-xs border px-2 py-0.5 rounded font-mono ${STATUS_STYLES[project.status]}`}>
              {project.status}
            </span>
          </div>
          <h3 className="text-text-primary font-semibold text-base truncate">{project.name}</h3>
          {project.tokenSymbol && (
            <span className="text-text-muted text-xs font-mono">${project.tokenSymbol}</span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onEdit(project)} className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-bg-elevated transition-all">
            <Edit2 size={13} />
          </button>
          <button onClick={() => onDelete(project)} className="p-1.5 rounded text-text-muted hover:text-status-red hover:bg-red-950/30 transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-text-muted text-xs leading-relaxed line-clamp-2">{project.description}</p>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-bg-elevated rounded-lg p-2 text-center">
          <Server size={12} className="text-purple mx-auto mb-1" />
          <p className="text-text-primary text-sm font-mono font-bold">{project.nodeCount || 0}</p>
          <p className="text-text-muted text-xs">Nodes</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-2 text-center">
          {isProfit ? <TrendingUp size={12} className="text-status-green mx-auto mb-1" /> : <TrendingDown size={12} className="text-status-red mx-auto mb-1" />}
          <p className={`text-sm font-mono font-bold ${isProfit ? 'text-status-green' : 'text-status-red'}`}>
            ${Math.abs(net).toFixed(0)}
          </p>
          <p className="text-text-muted text-xs">{isProfit ? 'Profit' : 'Loss'}</p>
        </div>
        <div className="bg-bg-elevated rounded-lg p-2 text-center">
          <p className="text-text-muted text-xs mb-1">Invested</p>
          <p className="text-text-primary text-sm font-mono font-bold">${project.roi?.invested || 0}</p>
          <p className="text-text-muted text-xs">USD</p>
        </div>
      </div>

      {/* ROI notes */}
      {project.roi?.notes && (
        <p className="text-text-muted text-xs bg-bg-elevated rounded px-3 py-2 font-mono">{project.roi.notes}</p>
      )}

      {/* Footer links */}
      <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-border-subtle/50">
        {project.website && (
          <a href={project.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors">
            <ExternalLink size={11} /> Website
          </a>
        )}
        {project.dashboardUrl && (
          <a href={project.dashboardUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors">
            <ExternalLink size={11} /> Dashboard
          </a>
        )}
        {project.hostingPlatform && (
          <span className="text-text-muted text-xs font-mono ml-auto">{project.hostingPlatform}</span>
        )}
        <button onClick={() => onViewArticles(project)}
          className="flex items-center gap-1 text-xs text-purple hover:text-purple-glow transition-colors ml-auto">
          <Newspaper size={11} /> Related Articles
        </button>
      </div>
    </div>
  );
}
