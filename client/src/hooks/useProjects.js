import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService } from '../services/projects';
import toast from 'react-hot-toast';

export const useProjects = () =>
  useQuery({ queryKey: ['projects'], queryFn: projectsService.getAll });

export const useProjectArticles = (id) =>
  useQuery({
    queryKey: ['projectArticles', id],
    queryFn: () => projectsService.getArticles(id),
    enabled: !!id,
  });

export const useCreateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectsService.create,
    onSuccess: () => { toast.success('Project created'); qc.invalidateQueries({ queryKey: ['projects'] }); },
    onError: () => toast.error('Failed to create project'),
  });
};

export const useUpdateProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => projectsService.update(id, payload),
    onSuccess: () => { toast.success('Project updated'); qc.invalidateQueries({ queryKey: ['projects'] }); },
    onError: () => toast.error('Failed to update project'),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: projectsService.remove,
    onSuccess: () => { toast.success('Project deleted'); qc.invalidateQueries({ queryKey: ['projects'] }); },
    onError: () => toast.error('Failed to delete project'),
  });
};
