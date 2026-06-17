import { apiClient } from './client';
import { ShareBrainResponse, SharedBrainResponse } from '@/types';

export const brainApi = {
  shareBrain: (share: boolean) =>
    apiClient.post<ShareBrainResponse>('/brain/share', { share }),

  getSharedBrain: (shareLink: string) =>
    apiClient.get<SharedBrainResponse>(`/brain/${shareLink}`),
};
