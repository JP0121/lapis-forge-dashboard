import api from './api';

export const alertsService = {
  getAll: async () => { const { data } = await api.get('/alerts'); return data; },
  create: async (payload) => { const { data } = await api.post('/alerts', payload); return data; },
  update: async (id, payload) => { const { data } = await api.put(`/alerts/${id}`, payload); return data; },
  remove: async (id) => { const { data } = await api.delete(`/alerts/${id}`); return data; },
  clearMatches: async (id) => { const { data } = await api.patch(`/alerts/${id}/clear`); return data; },
};
