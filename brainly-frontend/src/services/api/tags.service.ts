import { api } from "./axios";
import type { CreateTagRequest, GetTagsResponse } from "../../types/tags.types";

export const tagsService = {
  getTags: () => api.get<GetTagsResponse>("/tags"),

  createTag: (data: CreateTagRequest) =>
    api.post<{ message: string; tag: { _id: string; name: string; userId: string } }>("/tags", data),

  deleteTag: (id: string) => api.delete<{ message: string }>(`/tags/${id}`),
};
