import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Brain, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { brainApi } from '@/services/api/brain';
import { ContentItem } from '@/types';
import { COLORS } from '@/constants/colors';
import { ContentCardSkeleton } from '@/components/cards/ContentCardSkeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { CONTENT_TYPES } from '@/constants/contentTypes';
import { Badge } from '@/components/ui/Badge';
import { Image } from 'expo-image';

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return m ? m[1] : null;
}

function ReadOnlyCard({ item, index }: { item: ContentItem; index: number }) {
  const cfg = CONTENT_TYPES[item.type];
  const ytId = item.type === 'youtube' ? extractYouTubeId(item.link) : null;

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)} style={styles.card}>
      {ytId && (
        <Image
          source={{ uri: `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` }}
          style={styles.thumbnail}
          contentFit="cover"
        />
      )}
      <View style={styles.cardBody}>
        <Badge label={cfg.label} color={cfg.color} bgColor={cfg.lightColor} size="sm" />
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        {!!item.content && (
          <Text style={styles.cardExcerpt} numberOfLines={2}>{item.content}</Text>
        )}
        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 3).map((tag, i) => (
              <Badge
                key={typeof tag === 'string' ? tag : tag._id}
                label={`#${typeof tag === 'string' ? tag : tag.name}`}
                color={COLORS.textMuted}
                bgColor={COLORS.background}
                size="sm"
              />
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export default function SharedBrainScreen() {
  const { shareLink } = useLocalSearchParams<{ shareLink: string }>();
  const [username, setUsername] = useState('');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shareLink) return;
    (async () => {
      try {
        const res = await brainApi.getSharedBrain(shareLink);
        setUsername(res.data.username);
        setContent(res.data.content);
      } catch (err: any) {
        const msg = err?.response?.status === 404
          ? 'This brain no longer exists or the link has been revoked.'
          : 'Failed to load shared brain.';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [shareLink]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(auth)/signin')}
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.logoRow}>
          <Brain size={20} color={COLORS.primary} />
          <Text style={styles.logoText}>Brainly</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {isLoading ? (
        <View style={styles.content}>
          {Array.from({ length: 4 }).map((_, i) => <ContentCardSkeleton key={i} />)}
        </View>
      ) : error ? (
        <View style={styles.content}>
          <ErrorState message={error} />
        </View>
      ) : (
        <FlatList
          data={content}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => <ReadOnlyCard item={item} index={index} />}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.brainHeader}>
              <View style={styles.ownerAvatar}>
                <Text style={styles.ownerAvatarText}>{username[0]?.toUpperCase() ?? '?'}</Text>
              </View>
              <Text style={styles.brainTitle}>{username}'s Brain</Text>
              <Text style={styles.brainSubtitle}>{content.length} saved items</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  logoText: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  content: { padding: 16, paddingBottom: 40 },
  brainHeader: { alignItems: 'center', gap: 8, paddingVertical: 24 },
  ownerAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerAvatarText: { fontSize: 24, fontWeight: '700', color: '#fff' },
  brainTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: -0.3 },
  brainSubtitle: { fontSize: 13, color: COLORS.textMuted },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  thumbnail: { width: '100%', height: 160, backgroundColor: COLORS.border },
  cardBody: { padding: 14, gap: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, lineHeight: 21 },
  cardExcerpt: { fontSize: 13, color: COLORS.textMuted, lineHeight: 18 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
});
