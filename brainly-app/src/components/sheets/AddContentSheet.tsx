import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetScrollView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addContentSchema, AddContentFormValues } from '@/schemas';
import { COLORS } from '@/constants/colors';
import { CONTENT_TYPE_LIST, CONTENT_TYPES } from '@/constants/contentTypes';
import { ContentType } from '@/types';
import { useContentStore } from '@/store/contentStore';
import { useTagsStore } from '@/store/tagsStore';
import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Badge } from '@/components/ui/Badge';
import Toast from 'react-native-toast-message';

const SNAP_POINTS = ['92%'];

export const AddContentSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const { addContentItem } = useContentStore();
  const { tags } = useTagsStore();

  const { control, handleSubmit, watch, setValue, reset, formState: { isSubmitting } } = useForm<AddContentFormValues>({
    resolver: zodResolver(addContentSchema),
    defaultValues: { type: 'article', tags: [] },
  });

  const selectedType = watch('type');
  const selectedTags = watch('tags') ?? [];

  const handleClose = useCallback(() => {
    (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    reset({ type: 'article', tags: [] });
  }, [ref, reset]);

  const onSubmit = async (data: AddContentFormValues) => {
    try {
      await addContentItem(data);
      handleClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Something went wrong';
      Toast.show({ type: 'error', text1: 'Error', text2: msg });
    }
  };

  const toggleTag = (tagId: string) => {
    const current = selectedTags;
    const updated = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    setValue('tags', updated);
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
      <BottomSheetScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Add to Brain</Text>
          <TouchableOpacity onPress={handleClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <Field name="title" control={control} label="Title" placeholder="What is this about?" />
        <Field name="link" control={control} label="URL" placeholder="https://" keyboardType="url" />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
            {CONTENT_TYPE_LIST.map((t) => {
              const cfg = CONTENT_TYPES[t];
              const active = selectedType === t;
              return (
                <TouchableOpacity
                  key={t}
                  onPress={() => setValue('type', t as ContentType)}
                  style={[
                    styles.typeChip,
                    active
                      ? { backgroundColor: cfg.color, borderColor: cfg.color }
                      : { backgroundColor: COLORS.surface, borderColor: COLORS.border },
                  ]}
                >
                  <Text style={[styles.typeChipText, { color: active ? '#fff' : COLORS.textMuted }]}>
                    {cfg.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <Field
          name="content"
          control={control}
          label="Notes (optional)"
          placeholder="Add a quick note…"
          multiline
          numberOfLines={4}
        />

        {tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tags</Text>
            <View style={styles.tagsWrap}>
              {tags.map((tag) => {
                const active = selectedTags.includes(tag._id);
                return (
                  <TouchableOpacity key={tag._id} onPress={() => toggleTag(tag._id)}>
                    <Badge
                      label={`#${tag.name}`}
                      color={active ? COLORS.primary : COLORS.textMuted}
                      bgColor={active ? COLORS.primaryLight : COLORS.background}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <Button
          label="Save to Brain"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          fullWidth
          style={styles.submitBtn}
        />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

AddContentSheet.displayName = 'AddContentSheet';

const styles = StyleSheet.create({
  indicator: { backgroundColor: COLORS.border },
  background: { backgroundColor: COLORS.surface },
  content: { padding: 20, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  cancel: { fontSize: 15, color: COLORS.textMuted, fontWeight: '500' },
  section: { gap: 8 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, letterSpacing: 0.2 },
  typeRow: { gap: 8, paddingVertical: 2 },
  typeChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1.5,
  },
  typeChipText: { fontSize: 13, fontWeight: '600' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  submitBtn: { marginTop: 8 },
});
