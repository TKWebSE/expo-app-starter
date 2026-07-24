import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { AppConfirmDialog } from '@/components/ui/AppConfirmDialog';
import { AppSnackbar } from '@/components/ui/AppSnackbar';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { colors, radii, spacing, typography } from '@/theme/tokens';

export default function SettingsScreen() {
  const params = useLocalSearchParams<{ notice?: string }>();
  const [notice, setNotice] = useState(params.notice ?? null);
  const [confirmsLogout, setConfirmsLogout] = useState(false);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const error = useAuthStore((state) => state.error);
  const signOut = useAuthStore((state) => state.signOut);
  const clearError = useAuthStore((state) => state.clearError);
  const closeNotice = useCallback(() => setNotice(null), []);

  if (status === 'unauthenticated') {
    return <Redirect href="/login" />;
  }

  const confirmLogout = async () => {
    setConfirmsLogout(false);
    if (await signOut()) {
      router.replace('/login');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppSnackbar
        message={notice ?? error}
        onClose={notice ? closeNotice : clearError}
        type={notice ? 'success' : 'error'}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            accessibilityLabel="ホームへ戻る"
            accessibilityRole="button"
            onPress={() => router.replace('/home')}
            style={styles.back}
          >
            <Text style={styles.link}>戻る</Text>
          </Pressable>
          <Text accessibilityRole="header" style={styles.title}>
            設定
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>アカウント</Text>
          <Text style={styles.label}>メールアドレス</Text>
          <Text selectable style={styles.value}>
            {user?.email}
          </Text>
          <AppButton
            label="プロフィールを編集"
            onPress={() => router.push('/profile')}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>操作</Text>
          <AppButton
            disabled={isSubmitting}
            label="ログアウト"
            loading={isSubmitting}
            onPress={() => setConfirmsLogout(true)}
          />
        </View>
      </ScrollView>
      <AppConfirmDialog
        confirmLabel="ログアウト"
        danger
        message="この端末からログアウトしますか？"
        onCancel={() => setConfirmsLogout(false)}
        onConfirm={() => void confirmLogout()}
        title="ログアウトの確認"
        visible={confirmsLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: {
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    gap: spacing[4],
    padding: spacing[4],
  },
  header: { gap: spacing[2] },
  back: {
    minHeight: 44,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  link: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '600',
  },
  title: {
    color: colors.text,
    fontSize: typography.screenTitle,
    fontWeight: '700',
  },
  card: {
    gap: spacing[4],
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    padding: spacing[6],
  },
  sectionTitle: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: '700',
  },
  label: { color: colors.mutedText, fontSize: typography.helper },
  value: { color: colors.text, fontSize: typography.body },
});
