import { create } from "zustand";
import { tagsService } from "../services/api/tags.service";
import type { Tag } from "../types/tags.types";

interface TagsStore {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;

  fetchTags: () => Promise<void>;
  createTag: (name: string) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
}

export const useTagsStore = create<TagsStore>((set) => ({
  tags: [],
  isLoading: false,
  error: null,

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await tagsService.getTags();
      set({ tags: data.tags, isLoading: false });
    } catch {
      set({ error: "Failed to load tags", isLoading: false });
    }
  },

  createTag: async (name) => {
    const { data } = await tagsService.createTag({ name });
    set((state) => ({ tags: [...state.tags, data.tag] }));
  },

  deleteTag: async (id) => {
    await tagsService.deleteTag(id);
    set((state) => ({ tags: state.tags.filter((t) => t._id !== id) }));
  },
}));
