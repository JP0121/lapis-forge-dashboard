import api from './api';

export const projectsService = {
  getAll: async () => { const { data } = await api.get('/projects'); return data; },
  getOne: async (id) => { const { data } = await api.get(`/projects/${id}`); return data; },
  getArticles: async (id) => { const { data } = await api.get(`/projects/${id}/articles`); return data; },
  create: async (payload) => { const { data } = await api.post('/projects', payload); return data; },
  update: async (id, payload) => { const { data } = await api.put(`/projects/${id}`, payload); return data; },
  remove: async (id) => { const { data } = await api.delete(`/projects/${id}`); return data; },
};
