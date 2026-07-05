import { apiClient } from './apiClient';

const AI_CHAT_ENDPOINT = '/api/ai/chat';

export const AI_INTENTS = {
  REGISTER_VEHICLE_CARD: 'REGISTER_VEHICLE_CARD',
};

export async function sendAiMessage(payload) {
  const response = await apiClient.post(AI_CHAT_ENDPOINT, {
    sessionId: payload.sessionId,
    message: payload.message,
  });
  return response.data;
}
