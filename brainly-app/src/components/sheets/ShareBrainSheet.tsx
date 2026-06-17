import React, { forwardRef, useCallback, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import * as Clipboard from 'expo-clipboard';
import { Copy, Check, Share2, Trash2 } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { brainApi } from '@/services/api/brain';
import { COLORS } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import Toast from 'react-native-toast-message';

const SNAP_POINTS = ['55%'];
const BASE_URL = 'http://localhost:3000/api/v1/brain/';

export const ShareBrainSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const [shareHash, setShareHash] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClose = useCallback(() => {
    (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
  }, [ref]);

  const generateLink = async () => {
    setIsLoading(true);
    try {
      const res = await brainApi.shareBrain(true);
      if (res.data.hash) setShareHash(res.data.hash);
    } catch {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not generate link' });
    } finally {
      setIsLoading(false);
    }
  };

  const revokeLink = async () => {
    Alert.alert('Revoke Share Link', 'Anyone with the link will no longer be able to view your brain.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Revoke',
        style: 'destructive',
        onPress: async () => {
          try {
            await brainApi.shareBrain(false);
            setShareHash(null);
            Toast.show({ type: 'success', text1: 'Link revoked' });
          } catch {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Could not revoke link' });
          }
        },
      },
    ]);
  };

  const copyLink = async () => {
    if (!shareHash) return;
    await Clipboard.setStringAsync(`${BASE_URL}${shareHash}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={SNAP_POINTS}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.background}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.header}>
          <Share2 size={22} color={COLORS.primary} />
          <Text style={styles.title}>Share Your Brain</Text>
        </View>
        <Text style={styles.subtitle}>
          Generate a public link so anyone can view your saved content — no account needed.
        </Text>

        {shareHash ? (
          <View style={styles.linkBox}>
            <TextInput
              style={styles.linkInput}
              value={`${BASE_URL}${shareHash}`}
              editable={false}
              selectTextOnFocus
            />
            <TouchableOpacity onPress={copyLink} style={styles.copyBtn}>
              {copied ? (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <Check size={18} color={COLORS.success} />
                </Animated.View>
              ) : (
                <Animated.View entering={FadeIn} exiting={FadeOut}>
                  <Copy size={18} color={COLORS.primary} />
                </Animated.View>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <Button label="Generate Share Link" onPress={generateLink} loading={isLoading} fullWidth />
        )}

        {shareHash && (
          <TouchableOpacity onPress={revokeLink} style={styles.revokeBtn}>
            <Trash2 size={14} color={COLORS.danger} />
            <Text style={styles.revokeText}>Revoke link</Text>
          </TouchableOpacity>
        )}

        <Button label="Done" onPress={handleClose} variant="ghost" fullWidth />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

ShareBrainSheet.displayName = 'ShareBrainSheet';

const styles = StyleSheet.create({
  indicator: { backgroundColor: COLORS.border },
  background: { backgroundColor: COLORS.surface },
  content: { padding: 24, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  subtitle: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    gap: 8,
  },
  linkInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMuted,
    height: 44,
  },
  copyBtn: { padding: 4 },
  revokeBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center' },
  revokeText: { fontSize: 13, color: COLORS.danger, fontWeight: '500' },
});
