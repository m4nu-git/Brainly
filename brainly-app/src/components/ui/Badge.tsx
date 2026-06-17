import React from 'react';
import { Text, StyleSheet, View, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/colors';

interface BadgeProps {
  label: string;
  color?: string;
  bgColor?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function Badge({ label, color = COLORS.primary, bgColor = COLORS.primaryLight, size = 'md', style }: BadgeProps) {
  return (
    <View style={[styles.base, size === 'sm' ? styles.sm : styles.md, { backgroundColor: bgColor }, style]}>
      <Text style={[styles.text, size === 'sm' ? styles.smText : styles.mdText, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  md: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontWeight: '600',
  },
  smText: {
    fontSize: 11,
  },
  mdText: {
    fontSize: 12,
  },
});
