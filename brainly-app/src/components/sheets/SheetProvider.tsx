import React, { createContext, useContext, useRef, useCallback, ReactNode } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ContentItem } from '@/types';
import { useUiStore } from '@/store/uiStore';
import { AddContentSheet } from './AddContentSheet';
import { EditContentSheet } from './EditContentSheet';
import { ShareBrainSheet } from './ShareBrainSheet';
import { AddTagSheet } from './AddTagSheet';

interface SheetControls {
  openAddContent: () => void;
  openEditContent: (item: ContentItem) => void;
  openShareBrain: () => void;
  openAddTag: () => void;
}

const SheetContext = createContext<SheetControls>({
  openAddContent: () => {},
  openEditContent: () => {},
  openShareBrain: () => {},
  openAddTag: () => {},
});

export function useSheets() {
  return useContext(SheetContext);
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const addContentRef = useRef<BottomSheetModal>(null);
  const editContentRef = useRef<BottomSheetModal>(null);
  const shareBrainRef = useRef<BottomSheetModal>(null);
  const addTagRef = useRef<BottomSheetModal>(null);
  const { openSheet } = useUiStore();

  const openAddContent = useCallback(() => {
    openSheet('addContent');
    addContentRef.current?.present();
  }, [openSheet]);

  const openEditContent = useCallback(
    (item: ContentItem) => {
      openSheet('editContent', item);
      editContentRef.current?.present();
    },
    [openSheet]
  );

  const openShareBrain = useCallback(() => {
    openSheet('shareBrain');
    shareBrainRef.current?.present();
  }, [openSheet]);

  const openAddTag = useCallback(() => {
    openSheet('addTag');
    addTagRef.current?.present();
  }, [openSheet]);

  return (
    <SheetContext.Provider value={{ openAddContent, openEditContent, openShareBrain, openAddTag }}>
      {children}
      <AddContentSheet ref={addContentRef} />
      <EditContentSheet ref={editContentRef} />
      <ShareBrainSheet ref={shareBrainRef} />
      <AddTagSheet ref={addTagRef} />
    </SheetContext.Provider>
  );
}
