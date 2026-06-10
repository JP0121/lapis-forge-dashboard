import { useState } from 'react';
import { Plus, Layers } from 'lucide-react';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject, useProjectArticles } from '../hooks/useProjects';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectForm from '../components/projects/ProjectForm';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import ArticleCard from '../components/feed/ArticleCard';

export default function ProjectsPage() {
  const { data, isLoading } = useProjects();
  const { mutate: create, isPending: creating } = useCreateProject();
  const { mutate: update, isPending: updating } = useUpdateProject();
  const { mutate: remove } = useDeleteProject();

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [articlesProject, setArticlesProject] = useState(null);

  const projects = data?.projects || [];

  const handleSubmit = (payload) => {
    if (editTarget) {
      update({ id: editTarget._id, ...payload }, { onSuccess: () => { setShowForm(false); setEditTarget(null); } });
    } else {
      create(payload, { onSuccess: () => setShowForm(false) });
    }
  };

  const handleEdit = (project) => { setEditTarget(project); setShowForm(true); };
  const handleCloseForm = () => { setShowForm(false); setEditTarget(null); };

  const STATUS_ORDER = { active: 0, watching: 1, paused: 2, retired: 3 };
  const sorted = [...projects].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9));

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-muted text-sm">{projects.length} project{projects.length !== 1 ? 's' : ''} tracked</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={15} /> Add Project
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 space-y-3 animate-pulse h-64">
              <div className="h-4 bg-bg-elevated rounded w-1/3" />
              <div className="h-5 bg-bg-elevated rounded w-2/3" />
              <div className="h-16 bg-bg-elevated rounded" />
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState icon={Layers} title="No projects yet"
          description="Add DePIN nodes, AI projects, or any infrastructure you're running or watching."
          action={<button onClick={() => setShowForm(true)} className="btn-primary text-sm flex items-center gap-2"><Plus size={14} /> Add your first project</button>}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {sorted.map((p) => (
            <ProjectCard key={p._id} project={p}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
              onViewArticles={setArticlesProject}
            />
          ))}
        </div>
      )}

      {/* Add/Edit form */}
      <ProjectForm isOpen={showForm} onClose={handleCloseForm} onSubmit={handleSubmit}
        initialData={editTarget} isLoading={creating || updating} />

      {/* Delete confirm */}
      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={() => remove(deleteTarget._id)}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      />

      {/* Related articles modal */}
      <ArticlesModal project={articlesProject} onClose={() => setArticlesProject(null)} />
    </div>
  );
}

function ArticlesModal({ project, onClose }) {
  const { data, isLoading } = useProjectArticles(project?._id);
  const articles = data?.articles || [];

  return (
    <Modal isOpen={!!project} onClose={onClose} title={`${project?.name || ''} — Related Articles`} size="xl">
      <div className="p-6">
        {isLoading ? (
          <p className="text-text-muted text-sm text-center py-8">Loading articles...</p>
        ) : articles.length === 0 ? (
          <p className="text-text-muted text-sm text-center py-8">
            No articles matched this project's keywords yet. Add keywords in the project settings.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {articles.map((a) => <ArticleCard key={a._id} article={a} />)}
          </div>
        )}
      </div>
    </Modal>
  );
}
