import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsService } from '../services/alerts';
import toast from 'react-hot-toast';

export const useAlerts = () =>
  useQuery({ queryKey: ['alerts'], queryFn: alertsService.getAll });

export const useCreateAlert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: alertsService.create,
    onSuccess: () => { toast.success('Alert created'); qc.invalidateQueries({ queryKey: ['alerts'] }); },
    onError: () => toast.error('Failed to create alert'),
  });
};

export const useUpdateAlert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => alertsService.update(id, payload),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['alerts'] }); },
  });
};

export const useDeleteAlert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: alertsService.remove,
    onSuccess: () => { toast.success('Alert deleted'); qc.invalidateQueries({ queryKey: ['alerts'] }); },
  });
};

export const useClearMatches = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: alertsService.clearMatches,
    onSuccess: () => { toast.success('Matches cleared'); qc.invalidateQueries({ queryKey: ['alerts'] }); },
  });
};
