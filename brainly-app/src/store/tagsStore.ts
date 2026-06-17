import { create } from 'zustand';
import { Tag } from '@/types';
import { tagsApi } from '@/services/api/tags';
import Toast from 'react-native-toast-message';

interface TagsState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  addTag: (name: string) => Promise<void>;
  deleteTag: (id: string) => Promise<void>;
}

export const useTagsStore = create<TagsState>((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await tagsApi.getTags();
      set({ tags: res.data.tags, isLoading: false });
    } catch {
      set({ isLoading: false, error: 'Failed to load tags' });
    }
  },

  addTag: async (name) => {
    const res = await tagsApi.createTag(name);
    set((s) => ({ tags: [...s.tags, res.data.tag] }));
    Toast.show({ type: 'success', text1: 'Tag created', text2: `#${name} added` });
  },

  deleteTag: async (id) => {
    await tagsApi.deleteTag(id);
    set((s) => ({ tags: s.tags.filter((t) => t._id !== id) }));
    Toast.show({ type: 'success', text1: 'Tag deleted' });
  },
}));
