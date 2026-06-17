import { apiClient } from './client';
import { ContentItem, ContentFilters, ContentType } from '@/types';

export interface AddContentPayload {
  title: string;
  link: string;
  type: ContentType;
  content?: string;
  tags?: string[];
}

export interface EditContentPayload {
  title?: string;
  link?: string;
  type?: ContentType;
  content?: string;
  tags?: string[];
}

export const contentApi = {
  getContent: (filters: Partial<ContentFilters>) =>
    apiClient.get<{ content: ContentItem[] }>('/content', { params: filters }),

  addContent: (payload: AddContentPayload) =>
    apiClient.post<{ message: string }>('/content', payload),

  editContent: (id: string, payload: EditContentPayload) =>
    apiClient.put<{ message: string; content: ContentItem }>(`/content/${id}`, payload),

  deleteContent: (contentId: string) =>
    apiClient.delete<{ message: string }>('/content', { data: { contentId } }),
};
