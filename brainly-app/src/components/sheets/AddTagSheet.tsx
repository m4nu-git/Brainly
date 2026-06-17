import React, { forwardRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addTagSchema, AddTagFormValues } from '@/schemas';
import { useTagsStore } from '@/store/tagsStore';
import { COLORS } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import Toast from 'react-native-toast-message';

const SNAP_POINTS = ['40%'];

export const AddTagSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const { addTag } = useTagsStore();

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm<AddTagFormValues>({
    resolver: zodResolver(addTagSchema),
    defaultValues: { name: '' },
  });

  const handleClose = useCallback(() => {
    (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    reset();
  }, [ref, reset]);

  const onSubmit = async (data: AddTagFormValues) => {
    try {
      await addTag(data.name.toLowerCase().trim());
      handleClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Something went wrong';
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    }
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
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.background}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>New Tag</Text>
          <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <Field
          name="name"
          control={control}
          label="Tag name"
          placeholder="e.g. react, backend, design…"
          autoCapitalize="none"
        />

        <Button
          label="Create Tag"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          fullWidth
        />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

AddTagSheet.displayName = 'AddTagSheet';

const styles = StyleSheet.create({
  indicator: { backgroundColor: COLORS.border },
  background: { backgroundColor: COLORS.surface },
  content: { padding: 20, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  cancel: { fontSize: 15, color: COLORS.textMuted, fontWeight: '500' },
});
