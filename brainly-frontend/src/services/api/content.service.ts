import { api } from "./axios";
import type {
  CreateContentRequest,
  UpdateContentRequest,
  GetContentResponse,
  ContentFilters,
} from "../../types/content.types";

export const contentService = {
  getContent: (filters: Partial<ContentFilters> = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.tag) params.set("tag", filters.tag);
    if (filters.search) params.set("search", filters.search);
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    return api.get<GetContentResponse>(`/content?${params.toString()}`);
  },

  createContent: (data: CreateContentRequest) =>
    api.post<{ message: string }>("/content", data),

  updateContent: (id: string, data: UpdateContentRequest) =>
    api.put<{ message: string; content: unknown }>(`/content/${id}`, data),

  deleteContent: (contentId: string) =>
    api.delete<{ message: string }>("/content", { data: { contentId } }),
};
