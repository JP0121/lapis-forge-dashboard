import api from './api';

export const bookmarksService = {
  getAll: async ({ tag, search, page } = {}) => {
    const params = {};
    if (tag) params.tag = tag;
    if (search) params.search = search;
    if (page) params.page = page;
    const { data } = await api.get('/bookmarks', { params });
    return data;
  },
  upsertMeta: async (articleId, payload) => {
    const { data } = await api.put(`/bookmarks/${articleId}/meta`, payload);
    return data;
  },
};
