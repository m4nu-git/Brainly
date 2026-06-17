import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import { Image } from 'expo-image';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import {
  Trash2,
  PlayCircle,
  X,
  FileText,
  File,
  Link as LinkIcon,
  Globe,
  ArrowUpRight,
} from 'lucide-react-native';
import { ContentItem, ContentType } from '@/types';
import { COLORS } from '@/constants/colors';
import { CONTENT_TYPES } from '@/constants/contentTypes';
import { Badge } from '@/components/ui/Badge';
import { extractDomain } from '@/utils/formatters';

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return m ? m[1] : null;
}

const TYPE_ICONS: Record<ContentType, React.ElementType> = {
  youtube: PlayCircle,
  twitter: X,
  article: FileText,
  document: File,
  link: LinkIcon,
};

// ─── YouTube thumbnail with play button overlay ───────────────────────────────
function YouTubePreview({ videoId, link }: { videoId: string; link: string }) {
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(link)}
      activeOpacity={0.88}
      style={styles.thumbnailWrap}
    >
      <Image
        source={{ uri: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` }}
        style={styles.thumbnail}
        contentFit="cover"
      />
      {/* Dark gradient overlay */}
      <View style={styles.thumbnailOverlay} />
      {/* Play button */}
      <View style={styles.playBtnWrap}>
        <View style={styles.playBtn}>
          <PlayCircle size={40} color="#fff" />
        </View>
      </View>
      {/* "Tap to watch" label */}
      <View style={styles.ytBadge}>
        <PlayCircle size={10} color="#fff" />
        <Text style={styles.ytBadgeText}>YouTube</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Twitter / X styled card header ──────────────────────────────────────────
function TwitterPreview({ content, link }: { content: string; link: string }) {
  const domain = link.includes('x.com') ? 'x.com' : 'twitter.com';
  return (
    <TouchableOpacity
      onPress={() => Linking.openURL(link)}
      activeOpacity={0.88}
    >
      <View style={styles.twitterHeader}>
        {/* Top row */}
        <View style={styles.twitterTop}>
          <View style={styles.twitterXIcon}>
            <X size={16} color="#fff" />
          </View>
          <Text style={styles.twitterDomain}>{domain}</Text>
          <ArrowUpRight size={14} color="rgba(255,255,255,0.5)" />
        </View>

        {/* Tweet content preview */}
        {!!content && (
          <Text style={styles.twitterContent} numberOfLines={3}>
            {content}
          </Text>
        )}

        {/* Bottom CTA */}
        <View style={styles.twitterFooter}>
          <Text style={styles.twitterCta}>Open on X →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Swipe delete action ──────────────────────────────────────────────────────
function RightAction({ progress }: { progress: SharedValue<number>; drag: SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 1]),
  }));
  return (
    <Animated.View style={[styles.deleteAction, animatedStyle]}>
      <Trash2 size={22} color="#fff" />
    </Animated.View>
  );
}

// ─── Main card ────────────────────────────────────────────────────────────────
interface ContentCardProps {
  item: ContentItem;
  index: number;
  onPress: (item: ContentItem) => void;
  onDelete: (id: string) => void;
}

export const ContentCard = memo(function ContentCard({
  item,
  index,
  onPress,
  onDelete,
}: ContentCardProps) {
  const cfg = CONTENT_TYPES[item.type];
  const Icon = TYPE_ICONS[item.type];
  const ytId = item.type === 'youtube' ? extractYouTubeId(item.link) : null;
  const domain = extractDomain(item.link);

  const handleDelete = useCallback(() => {
    Alert.alert('Delete Content', 'Remove this from your brain?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(item._id) },
    ]);
  }, [item._id, onDelete]);

  const renderRightActions = useCallback(
    (progress: SharedValue<number>, drag: SharedValue<number>) => (
      <TouchableOpacity onPress={handleDelete} activeOpacity={0.8}>
        <RightAction progress={progress} drag={drag} />
      </TouchableOpacity>
    ),
    [handleDelete]
  );

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
      <ReanimatedSwipeable
        friction={2}
        rightThreshold={40}
        renderRightActions={renderRightActions}
        containerStyle={styles.swipeContainer}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => onPress(item)}
          activeOpacity={0.85}
        >
          {/* ── Media header ─────────────────────────────────────── */}
          {item.type === 'youtube' && ytId && (
            <YouTubePreview videoId={ytId} link={item.link} />
          )}

          {item.type === 'twitter' && (
            <TwitterPreview content={item.content} link={item.link} />
          )}

          {/* ── Card body ─────────────────────────────────────────── */}
          <View style={styles.body}>
            <View style={styles.typeRow}>
              <View style={[styles.typeIconWrap, { backgroundColor: cfg.lightColor }]}>
                <Icon size={12} color={cfg.color} />
              </View>
              <Badge label={cfg.label} color={cfg.color} bgColor={cfg.lightColor} size="sm" />
            </View>

            <Text style={styles.title} numberOfLines={2}>{item.title}</Text>

            {!!item.content && item.type !== 'twitter' && (
              <Text style={styles.excerpt} numberOfLines={2}>{item.content}</Text>
            )}

            {item.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag._id}
                    label={`#${tag.name}`}
                    color={COLORS.textMuted}
                    bgColor={COLORS.background}
                    size="sm"
                  />
                ))}
                {item.tags.length > 3 && (
                  <Text style={styles.moreText}>+{item.tags.length - 3} more</Text>
                )}
              </View>
            )}

            {/* ── Domain / open link row ──────────────────────────── */}
            <TouchableOpacity
              onPress={() => Linking.openURL(item.link)}
              style={styles.linkRow}
              hitSlop={{ top: 4, bottom: 4 }}
            >
              <Globe size={12} color={COLORS.textMuted} />
              <Text style={styles.linkDomain} numberOfLines={1}>{domain}</Text>
              <ArrowUpRight size={12} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ReanimatedSwipeable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  swipeContainer: { marginBottom: 12 },

  deleteAction: {
    width: 72,
    backgroundColor: COLORS.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // ─── YouTube ────────────────────────────────────────────────────────────────
  thumbnailWrap: { position: 'relative' },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.border,
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  playBtnWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ytBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ytBadgeText: { fontSize: 11, color: '#fff', fontWeight: '600' },

  // ─── Twitter / X ────────────────────────────────────────────────────────────
  twitterHeader: {
    backgroundColor: '#0F172A',
    padding: 16,
    gap: 10,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  twitterTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  twitterXIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  twitterDomain: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  twitterContent: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    fontWeight: '400',
  },
  twitterFooter: { alignItems: 'flex-end' },
  twitterCta: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
  },

  // ─── Card body ───────────────────────────────────────────────────────────────
  body: { padding: 14, gap: 8 },

  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 21,
  },
  excerpt: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    alignItems: 'center',
  },
  moreText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  // ─── Domain / link row ───────────────────────────────────────────────────────
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingTop: 2,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 2,
    paddingVertical: 6,
  },
  linkDomain: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
