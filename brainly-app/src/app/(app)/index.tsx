import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Hash, X } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn, FadeOut } from 'react-native-reanimated';
import { useContentStore } from '@/store/contentStore';
import { useTagsStore } from '@/store/tagsStore';
import { ContentItem } from '@/types';
import { FilterType, ALL_FILTER } from '@/constants/contentTypes';
import { ContentType } from '@/types';
import { COLORS } from '@/constants/colors';
import { ContentCard } from '@/components/cards/ContentCard';
import { ContentCardSkeleton } from '@/components/cards/ContentCardSkeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { FilterBar } from '@/components/common/FilterBar';
import { Button } from '@/components/ui/Button';
import { useSheets } from '@/components/sheets/SheetProvider';
import { useDebounce } from '@/hooks/useDebounce';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';

export default function DashboardScreen() {
  const {
    items,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    error,
    filters,
    fetchContent,
    loadMore,
    refresh,
    setTypeFilter,
    setSearchFilter,
    setTagFilter,
    deleteContentItem,
  } = useContentStore();
  const { tags: allTags, fetchTags } = useTagsStore();
  const { openAddContent, openEditContent } = useSheets();

  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>(ALL_FILTER);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Look up tag name for active tag pill
  const activeTag = filters.tag
    ? allTags.find((t) => t._id === filters.tag)
    : undefined;

  useEffect(() => {
    fetchContent(true);
    fetchTags();
  }, [fetchContent, fetchTags]);

  useEffect(() => {
    setSearchFilter(debouncedSearch);
    fetchContent(true);
  }, [debouncedSearch, setSearchFilter, fetchContent]);

  // Re-fetch when tab is focused — picks up tag filters set from Tags screen
  useRefreshOnFocus(useCallback(() => fetchContent(true), [fetchContent]));

  const handleFilterChange = useCallback(
    (f: FilterType) => {
      setActiveFilter(f);
      setTypeFilter(f === ALL_FILTER ? undefined : (f as ContentType));
      fetchContent(true);
    },
    [setTypeFilter, fetchContent]
  );

  const clearTagFilter = useCallback(() => {
    setTagFilter(undefined);
    fetchContent(true);
  }, [setTagFilter, fetchContent]);

  const handleCardPress = useCallback(
    (item: ContentItem) => openEditContent(item),
    [openEditContent]
  );

  const handleDelete = useCallback(
    (id: string) => deleteContentItem(id),
    [deleteContentItem]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ContentItem; index: number }) => (
      <ContentCard
        item={item}
        index={index}
        onPress={handleCardPress}
        onDelete={handleDelete}
      />
    ),
    [handleCardPress, handleDelete]
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <Button
          label="Load More"
          onPress={loadMore}
          loading={isLoadingMore}
          variant="secondary"
        />
      </View>
    );
  };

  const renderEmpty = () => {
    if (isLoading) return null;
    if (error) {
      return <ErrorState message={error} onRetry={() => fetchContent(true)} />;
    }
    return (
      <EmptyState
        onAction={openAddContent}
        actionLabel="Add First Bookmark"
        subtitle={
          activeTag
            ? `No content tagged #${activeTag.name}`
            : debouncedSearch
            ? `No results for "${debouncedSearch}"`
            : 'Start saving content to build your second brain.'
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Brain</Text>
          <Text style={styles.headerCount}>
            {items.length > 0 ? `${items.length} items` : ''}
          </Text>
        </View>

        <FilterBar
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          search={searchInput}
          onSearchChange={setSearchInput}
        />

        {/* Active tag filter pill */}
        {activeTag && (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(150)}
            style={styles.activeTagRow}
          >
            <View style={styles.activeTagPill}>
              <Hash size={12} color={COLORS.primary} />
              <Text style={styles.activeTagText}>{activeTag.name}</Text>
              <TouchableOpacity
                onPress={clearTagFilter}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
              >
                <X size={12} color={COLORS.primary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            <Text style={styles.activeTagLabel}>Filtering by tag</Text>
          </Animated.View>
        )}

        {isLoading && items.length === 0 ? (
          <View style={styles.skeletonList}>
            {Array.from({ length: 4 }).map((_, i) => (
              <ContentCardSkeleton key={i} />
            ))}
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmpty}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refresh}
                tintColor={COLORS.primary}
                colors={[COLORS.primary]}
              />
            }
          />
        )}

        <TouchableOpacity
          onPress={openAddContent}
          style={styles.fab}
          activeOpacity={0.85}
        >
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

  // Active tag pill
  activeTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  activeTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  activeTagText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  activeTagLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  list: { paddingTop: 12, paddingBottom: 80 },
  skeletonList: { paddingTop: 12 },
  footer: { alignItems: 'center', paddingVertical: 16 },
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
