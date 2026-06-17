import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Hash, Trash2, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useTagsStore } from '@/store/tagsStore';
import { useContentStore } from '@/store/contentStore';
import { Tag } from '@/types';
import { COLORS } from '@/constants/colors';
import { EmptyState } from '@/components/common/EmptyState';
import { useSheets } from '@/components/sheets/SheetProvider';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { Skeleton } from '@/components/ui/Skeleton';

export default function TagsScreen() {
  const { tags, isLoading, fetchTags, deleteTag } = useTagsStore();
  const { setTagFilter } = useContentStore();
  const { openAddTag } = useSheets();

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useRefreshOnFocus(useCallback(() => fetchTags(), [fetchTags]));

  const handleFilterByTag = useCallback(
    (tag: Tag) => {
      setTagFilter(tag._id);
      router.navigate('/(app)');
    },
    [setTagFilter]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Tag; index: number }) => (
      <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
        <View style={styles.tagRow}>
          {/* Left — tappable to filter in Brain */}
          <TouchableOpacity
            style={styles.tagLeft}
            onPress={() => handleFilterByTag(item)}
            activeOpacity={0.65}
          >
            <View style={styles.hashWrap}>
              <Hash size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.tagName}>{item.name}</Text>
          </TouchableOpacity>

          {/* Right — filter hint + delete */}
          <View style={styles.tagActions}>
            <View style={styles.filterHint}>
              <ChevronRight size={14} color={COLORS.textMuted} />
            </View>
            <TouchableOpacity
              onPress={() => deleteTag(item._id)}
              style={styles.deleteBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={16} color={COLORS.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    ),
    [deleteTag, handleFilterByTag]
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <EmptyState
        title="No tags yet"
        subtitle="Create tags to organize your saved content."
        onAction={openAddTag}
        actionLabel="Create First Tag"
        icon={<Hash size={48} color={COLORS.primary} strokeWidth={1.5} />}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tags</Text>
          <Text style={styles.headerCount}>{tags.length > 0 ? `${tags.length} tags` : ''}</Text>
        </View>

        {tags.length > 0 && (
          <Text style={styles.hint}>Tap a tag to filter your Brain</Text>
        )}

        {isLoading && tags.length === 0 ? (
          <View style={styles.skeletonList}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={styles.skeletonRow}>
                <Skeleton width={36} height={36} borderRadius={10} />
                <Skeleton width="60%" height={16} />
              </View>
            ))}
          </View>
        ) : (
          <FlatList
            data={tags}
            renderItem={renderItem}
            keyExtractor={(t) => t._id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={fetchTags}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
          />
        )}

        <TouchableOpacity onPress={openAddTag} style={styles.fab} activeOpacity={0.85}>
          <Plus size={24} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  headerCount: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 10,
    marginTop: -4,
  },
  list: { paddingTop: 4, paddingBottom: 80 },
  skeletonList: { paddingTop: 8, gap: 12 },
  skeletonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },

  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  tagLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  hashWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagName: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },

  tagActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingRight: 12,
  },
  filterHint: {
    paddingHorizontal: 4,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: COLORS.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
