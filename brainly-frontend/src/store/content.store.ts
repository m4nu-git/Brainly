import { create } from "zustand";
import { contentService } from "../services/api/content.service";
import type { Content, ContentFilters, CreateContentRequest, UpdateContentRequest } from "../types/content.types";

interface ContentStore {
  items: Content[];
  filters: ContentFilters;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;

  fetchContent: () => Promise<void>;
  createContent: (data: CreateContentRequest) => Promise<void>;
  updateContent: (id: string, data: UpdateContentRequest) => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  setFilter: <K extends keyof ContentFilters>(key: K, value: ContentFilters[K]) => void;
  resetFilters: () => void;
  nextPage: () => void;
  prevPage: () => void;
}

const DEFAULT_FILTERS: ContentFilters = {
  type: "",
  tag: "",
  search: "",
  page: 1,
  limit: 12,
};

export const useContentStore = create<ContentStore>((set, get) => ({
  items: [],
  filters: { ...DEFAULT_FILTERS },
  isLoading: false,
  error: null,
  hasMore: false,

  fetchContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const activeFilters = {
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.tag ? { tag: filters.tag } : {}),
        ...(filters.search ? { search: filters.search } : {}),
        page: filters.page,
        limit: filters.limit,
      };
      const { data } = await contentService.getContent(activeFilters);
      set({
        items: data.content,
        hasMore: data.content.length === filters.limit,
        isLoading: false,
      });
    } catch {
      set({ error: "Failed to load content", isLoading: false });
    }
  },

  createContent: async (data) => {
    await contentService.createContent(data);
    get().fetchContent();
  },

  updateContent: async (id, data) => {
    await contentService.updateContent(id, data);
    get().fetchContent();
  },

  deleteContent: async (id) => {
    await contentService.deleteContent(id);
    set((state) => ({
      items: state.items.filter((item) => item._id !== id),
    }));
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value, page: key !== "page" ? 1 : state.filters.page },
    }));
  },

  resetFilters: () => {
    set({ filters: { ...DEFAULT_FILTERS } });
  },

  nextPage: () => {
    set((state) => ({
      filters: { ...state.filters, page: state.filters.page + 1 },
    }));
  },

  prevPage: () => {
    set((state) => ({
      filters: {
        ...state.filters,
        page: Math.max(1, state.filters.page - 1),
      },
    }));
  },
}));
