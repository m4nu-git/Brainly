import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Share2, LogOut, ChevronRight, User } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { COLORS } from '@/constants/colors';
import { useSheets } from '@/components/sheets/SheetProvider';
import { getInitials } from '@/utils/formatters';

export default function SettingsScreen() {
  const { username, logout } = useAuthStore();
  const { openShareBrain } = useSheets();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTitle}>Settings</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {username ? getInitials(username) : '?'}
            </Text>
          </View>
          <View>
            <Text style={styles.username}>{username}</Text>
            <Text style={styles.profileSub}>Brainly account</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brain</Text>

          <TouchableOpacity style={styles.row} onPress={openShareBrain}>
            <View style={[styles.rowIcon, { backgroundColor: COLORS.primaryLight }]}>
              <Share2 size={18} color={COLORS.primary} />
            </View>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Share Brain</Text>
              <Text style={styles.rowSub}>Generate a public link</Text>
            </View>
            <ChevronRight size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.row} onPress={handleLogout}>
            <View style={[styles.rowIcon, { backgroundColor: COLORS.dangerLight }]}>
              <LogOut size={18} color={COLORS.danger} />
            </View>
            <View style={styles.rowContent}>
              <Text style={[styles.rowLabel, { color: COLORS.danger }]}>Sign Out</Text>
              <Text style={styles.rowSub}>You'll need to sign in again</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Brainly v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, paddingBottom: 40, gap: 20 },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    paddingVertical: 8,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  username: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  profileSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  section: { gap: 8 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  rowSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  version: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginTop: 8 },
});
