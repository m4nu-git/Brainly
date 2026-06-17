import { apiClient } from './client';
import { Tag } from '@/types';

export const tagsApi = {
  getTags: () => apiClient.get<{ tags: Tag[] }>('/tags'),

  createTag: (name: string) =>
    apiClient.post<{ message: string; tag: Tag }>('/tags', { name }),

  deleteTag: (id: string) =>
    apiClient.delete<{ message: string }>(`/tags/${id}`),
};
