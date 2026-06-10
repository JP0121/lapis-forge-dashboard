import api from './api';

export const analyticsService = {
  getOverview: async () => { const { data } = await api.get('/analytics/overview'); return data; },
  getTrending: async () => { const { data } = await api.get('/analytics/trending'); return data; },
  generateDigest: async () => { const { data } = await api.post('/analytics/digest'); return data; },
};
