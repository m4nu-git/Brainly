import { create } from 'zustand';
import { ContentItem, ContentFilters, ContentType } from '@/types';
import { contentApi } from '@/services/api/content';
import Toast from 'react-native-toast-message';

const DEFAULT_FILTERS: ContentFilters = { page: 1, limit: 20 };

interface ContentState {
  items: ContentItem[];
  filters: ContentFilters;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  isRefreshing: boolean;
  error: string | null;

  setFilter: (key: keyof ContentFilters, value: string | number | undefined) => void;
  setTypeFilter: (type: ContentType | undefined) => void;
  setSearchFilter: (search: string) => void;
  setTagFilter: (tagId: string | undefined) => void;
  resetFilters: () => void;

  fetchContent: (replace?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  addContentItem: (payload: Parameters<typeof contentApi.addContent>[0]) => Promise<void>;
  editContentItem: (id: string, payload: Parameters<typeof contentApi.editContent>[1]) => Promise<void>;
  deleteContentItem: (id: string) => Promise<void>;
}

export const useContentStore = create<ContentState>((set, get) => ({
  items: [],
  filters: DEFAULT_FILTERS,
  hasMore: false,
  isLoading: false,
  isLoadingMore: false,
  isRefreshing: false,
  error: null,

  setFilter: (key, value) => {
    set((s) => ({ filters: { ...s.filters, [key]: value, page: 1 } }));
  },

  setTypeFilter: (type) => {
    set((s) => ({ filters: { ...s.filters, type, page: 1 } }));
  },

  setSearchFilter: (search) => {
    set((s) => ({ filters: { ...s.filters, search: search || undefined, page: 1 } }));
  },

  setTagFilter: (tagId) => {
    set((s) => ({ filters: { ...s.filters, tag: tagId, page: 1 } }));
  },

  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS });
  },

  fetchContent: async (replace = true) => {
    const { filters } = get();
    set({ isLoading: true, error: null });
    try {
      const res = await contentApi.getContent(filters);
      const incoming = res.data.content;
      set((s) => ({
        items: replace ? incoming : [...s.items, ...incoming],
        hasMore: incoming.length === filters.limit,
        isLoading: false,
      }));
    } catch {
      set({ isLoading: false, error: 'Failed to load content' });
    }
  },

  loadMore: async () => {
    const { filters, isLoadingMore, hasMore } = get();
    if (isLoadingMore || !hasMore) return;
    set({ isLoadingMore: true });
    const nextPage = filters.page + 1;
    try {
      const res = await contentApi.getContent({ ...filters, page: nextPage });
      const incoming = res.data.content;
      set((s) => ({
        items: [...s.items, ...incoming],
        hasMore: incoming.length === filters.limit,
        filters: { ...s.filters, page: nextPage },
        isLoadingMore: false,
      }));
    } catch {
      set({ isLoadingMore: false });
    }
  },

  refresh: async () => {
    const { filters } = get();
    set({ isRefreshing: true });
    try {
      const res = await contentApi.getContent({ ...filters, page: 1 });
      set({
        items: res.data.content,
        hasMore: res.data.content.length === filters.limit,
        filters: { ...filters, page: 1 },
        isRefreshing: false,
      });
    } catch {
      set({ isRefreshing: false });
    }
  },

  addContentItem: async (payload) => {
    await contentApi.addContent(payload);
    Toast.show({ type: 'success', text1: 'Saved!', text2: 'Content added to your brain' });
    get().fetchContent(true);
  },

  editContentItem: async (id, payload) => {
    await contentApi.editContent(id, payload);
    Toast.show({ type: 'success', text1: 'Updated', text2: 'Content updated successfully' });
    get().fetchContent(true);
  },

  deleteContentItem: async (id) => {
    await contentApi.deleteContent(id);
    set((s) => ({ items: s.items.filter((i) => i._id !== id) }));
    Toast.show({ type: 'success', text1: 'Deleted', text2: 'Content removed from your brain' });
  },
}));
