import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesService } from '../services/articles';
import toast from 'react-hot-toast';

export const useArticles = ({ category, page, unreadOnly, search } = {}) => {
  return useQuery({
    queryKey: ['articles', { category, page, unreadOnly, search }],
    queryFn: () => articlesService.getArticles({ category, page, unreadOnly, search }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true,
  });
};

export const useArticleStats = () => {
  return useQuery({
    queryKey: ['articleStats'],
    queryFn: articlesService.getStats,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 5 * 60 * 1000, // Refresh stats every 5 min
  });
};

export const useMarkRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isRead }) => articlesService.markRead(id, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['articleStats'] });
    },
  });
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (category) => articlesService.markAllRead(category),
    onSuccess: (data) => {
      toast.success(`Marked ${data.updated} articles as read`);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.invalidateQueries({ queryKey: ['articleStats'] });
    },
  });
};

export const useToggleBookmark = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => articlesService.toggleBookmark(id),
    onSuccess: (data) => {
      toast.success(data.isBookmarked ? 'Bookmarked' : 'Removed from bookmarks');
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

export const useTriggerRefresh = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: articlesService.triggerRefresh,
    onSuccess: () => {
      toast.success('Feed refresh started — new articles incoming');
      // Re-fetch after a short delay to pick up new articles
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['articles'] });
        queryClient.invalidateQueries({ queryKey: ['articleStats'] });
      }, 3000);
    },
    onError: () => {
      toast.error('Refresh failed');
    },
  });
};
