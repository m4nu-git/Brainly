import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/ui/Skeleton';
import { COLORS } from '@/constants/colors';

export function ContentCardSkeleton() {
  return (
    <View style={styles.card}>
      <Skeleton height={160} borderRadius={0} />
      <View style={styles.body}>
        <View style={styles.row}>
          <Skeleton width={22} height={22} borderRadius={6} />
          <Skeleton width={60} height={20} borderRadius={10} />
        </View>
        <Skeleton width="85%" height={18} />
        <Skeleton width="60%" height={18} />
        <Skeleton width="100%" height={13} />
        <Skeleton width="75%" height={13} />
        <View style={styles.row}>
          <Skeleton width={55} height={20} borderRadius={10} />
          <Skeleton width={70} height={20} borderRadius={10} />
          <Skeleton width={50} height={20} borderRadius={10} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  body: {
    padding: 14,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
});
