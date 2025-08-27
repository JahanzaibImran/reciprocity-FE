import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const personaApi = {
  getTraits: () => api.get('/persona/traits'),
  generatePersona: (selectedTraitIds: string[], isSelf: boolean = true) => 
    api.post('/persona/generate', { selectedTraitIds, isSelf }),
  savePersona: (userId: number, selection: any) =>
    api.post(`/persona/save/${userId}`, selection),
  getMatches: (userId: number) =>
    api.get(`/persona/matches/${userId}`),
};

export default api;