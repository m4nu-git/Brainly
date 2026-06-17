import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { BounceIn } from 'react-native-reanimated';
import { Brain } from 'lucide-react-native';
import { COLORS } from '@/constants/colors';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  onAction?: () => void;
  actionLabel?: string;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = 'Your brain is empty',
  subtitle = 'Start saving content to build your second brain.',
  onAction,
  actionLabel = 'Add Content',
  icon,
}: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Animated.View entering={BounceIn.duration(600)} style={styles.iconWrap}>
        {icon ?? <Brain size={56} color={COLORS.primary} strokeWidth={1.5} />}
      </Animated.View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {onAction && (
        <Button label={actionLabel} onPress={onAction} style={styles.btn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  btn: { marginTop: 8 },
});
