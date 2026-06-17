import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, TextInput } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { CONTENT_TYPE_LIST, CONTENT_TYPES, FilterType, ALL_FILTER } from '@/constants/contentTypes';
import { ContentType } from '@/types';

interface FilterBarProps {
  activeFilter: FilterType;
  onFilterChange: (f: FilterType) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export function FilterBar({ activeFilter, onFilterChange, search, onSearchChange }: FilterBarProps) {
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Search size={16} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search your brain…"
          placeholderTextColor={COLORS.textMuted}
          value={search}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        <TouchableOpacity
          onPress={() => onFilterChange(ALL_FILTER)}
          style={[styles.chip, activeFilter === ALL_FILTER && styles.chipActive]}
        >
          <Text style={[styles.chipText, activeFilter === ALL_FILTER && styles.chipTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        {CONTENT_TYPE_LIST.map((type) => {
          const cfg = CONTENT_TYPES[type];
          const active = activeFilter === type;
          return (
            <TouchableOpacity
              key={type}
              onPress={() => onFilterChange(type as ContentType)}
              style={[
                styles.chip,
                active && { backgroundColor: cfg.color, borderColor: cfg.color },
              ]}
            >
              <Text
                style={[styles.chipText, active && { color: '#fff' }]}
              >
                {cfg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    height: '100%',
  },
  filtersRow: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  chipTextActive: {
    color: '#fff',
  },
});
