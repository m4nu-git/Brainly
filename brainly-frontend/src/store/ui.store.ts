import { create } from "zustand";
import type { Content } from "../types/content.types";

interface UiStore {
  isAddContentOpen: boolean;
  isShareBrainOpen: boolean;
  isAddTagOpen: boolean;
  editingContent: Content | null;
  deletingContent: Content | null;
  isMobileSidebarOpen: boolean;

  openAddContent: () => void;
  closeAddContent: () => void;
  openShareBrain: () => void;
  closeShareBrain: () => void;
  openAddTag: () => void;
  closeAddTag: () => void;
  openEditContent: (content: Content) => void;
  closeEditContent: () => void;
  openDeleteContent: (content: Content) => void;
  closeDeleteContent: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isAddContentOpen: false,
  isShareBrainOpen: false,
  isAddTagOpen: false,
  editingContent: null,
  deletingContent: null,
  isMobileSidebarOpen: false,

  openAddContent: () => set({ isAddContentOpen: true }),
  closeAddContent: () => set({ isAddContentOpen: false }),
  openShareBrain: () => set({ isShareBrainOpen: true }),
  closeShareBrain: () => set({ isShareBrainOpen: false }),
  openAddTag: () => set({ isAddTagOpen: true }),
  closeAddTag: () => set({ isAddTagOpen: false }),
  openEditContent: (content) => set({ editingContent: content }),
  closeEditContent: () => set({ editingContent: null }),
  openDeleteContent: (content) => set({ deletingContent: content }),
  closeDeleteContent: () => set({ deletingContent: null }),
  toggleMobileSidebar: () =>
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
  closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
}));
