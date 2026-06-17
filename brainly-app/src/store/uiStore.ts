import { create } from 'zustand';
import { ContentItem } from '@/types';

type ActiveSheet = 'addContent' | 'editContent' | 'shareBrain' | 'addTag' | null;

interface UiState {
  activeSheet: ActiveSheet;
  editingItem: ContentItem | null;
  openSheet: (sheet: Exclude<ActiveSheet, null>, item?: ContentItem) => void;
  closeSheet: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeSheet: null,
  editingItem: null,

  openSheet: (sheet, item) => {
    set({ activeSheet: sheet, editingItem: item ?? null });
  },

  closeSheet: () => {
    set({ activeSheet: null, editingItem: null });
  },
}));
