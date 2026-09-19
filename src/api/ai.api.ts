import api from './client';

export const aiApi = {
  sendChatMessage: async (message: string) => {
    const { data } = await api.post('/ai/chat', { message });
    return data.data;
  },
};
