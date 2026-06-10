import api from './api';

export const articlesService = {
  getArticles: async ({ category, page = 1, unreadOnly = false, search = '' } = {}) => {
    const params = { page };
    if (category && category !== 'all') params.category = category;
    if (unreadOnly) params.unreadOnly = true;
    if (search) params.search = search;
    const { data } = await api.get('/articles', { params });
    return data;
  },

  getStats: async () => {
    const { data } = await api.get('/articles/stats');
    return data;
  },

  markRead: async (id, isRead = true) => {
    const { data } = await api.patch(`/articles/${id}/read`, { isRead });
    return data;
  },

  markAllRead: async (category) => {
    const { data } = await api.patch('/articles/mark-all-read', { category });
    return data;
  },

  toggleBookmark: async (id) => {
    const { data } = await api.patch(`/articles/${id}/bookmark`);
    return data;
  },

  triggerRefresh: async () => {
    const { data } = await api.post('/articles/refresh');
    return data;
  },
};
