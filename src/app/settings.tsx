import { useQuery } from '@tanstack/react-query';
import {
  Link,
  Redirect,
  router,
  useLocalSearchParams,
  type Href,
} from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { AppButton } from '@/components/ui/AppButton';
import { AppConfirmDialog } from '@/components/ui/AppConfirmDialog';
import { AppSnackbar } from '@/components/ui/AppSnackbar';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { SupabaseProfileRepository } from '@/features/profile/repositories/SupabaseProfileRepository';
import { loadProfile } from '@/features/profile/utils/profileWorkflow';
import {
  type ThemePreference,
  useThemePreference,
} from '@/theme/ThemeProvider';
import { radii, spacing, type ThemeColors, typography } from '@/theme/tokens';

const profileRepository = new SupabaseProfileRepository();

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
  const { colors, preference, setPreference } = useThemePreference();
  const styles = createStyles(colors);
  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => loadProfile(profileRepository, user!.id),
    enabled: Boolean(user?.id),
  });

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
    <AppShell title="設定">
      <AppSnackbar
        message={notice ?? error}
        onClose={notice ? closeNotice : clearError}
        type={notice ? 'success' : 'error'}
      />
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>アカウント</Text>
        <Text style={styles.label}>表示名</Text>
        <Text selectable style={styles.value}>
          {profileQuery.isPending
            ? '読み込み中…'
            : profileQuery.data?.displayName || '未設定'}
        </Text>
        <Text style={styles.label}>メールアドレス</Text>
        <Text selectable style={styles.value}>
          {user?.email}
        </Text>
        <AppButton
          label="プロフィールを編集"
          onPress={() => router.push('/profile')}
        />
        <AppButton
          label="メールアドレスを変更"
          onPress={() => router.push('/change-email' as Href)}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>表示</Text>
        <Text style={styles.label}>テーマ</Text>
        <View style={styles.themeOptions}>
          {(
            [
              ['system', '端末設定'],
              ['light', 'ライト'],
              ['dark', 'ダーク'],
            ] as const
          ).map(([value, label]) => (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityState={{ checked: preference === value }}
              onPress={() => setPreference(value as ThemePreference)}
              style={[
                styles.themeOption,
                preference === value && styles.themeOptionActive,
              ]}
            >
              <Text style={preference === value ? styles.link : styles.value}>
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>アプリ情報</Text>
        <Text style={styles.value}>Expo App Starter v0.1.0</Text>
        <Link href={'/terms' as Href} style={styles.link}>
          利用規約
        </Link>
        <Link href={'/privacy' as Href} style={styles.link}>
          プライバシーポリシー
        </Link>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>操作</Text>
        <AppButton
          disabled={isSubmitting}
          label="ログアウト"
          loading={isSubmitting}
          onPress={() => setConfirmsLogout(true)}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/delete-account' as Href)}
          style={styles.dangerLink}
        >
          <Text style={styles.dangerText}>アカウントを削除</Text>
        </Pressable>
      </View>
      <AppConfirmDialog
        confirmLabel="ログアウト"
        danger
        message="この端末からログアウトしますか？"
        onCancel={() => setConfirmsLogout(false)}
        onConfirm={() => void confirmLogout()}
        title="ログアウトの確認"
        visible={confirmsLogout}
      />
    </AppShell>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
    themeOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] },
    themeOption: {
      minHeight: 44,
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.control,
      paddingHorizontal: spacing[4],
    },
    themeOptionActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '26',
    },
    dangerLink: {
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dangerText: {
      color: colors.error,
      fontSize: typography.body,
      fontWeight: '700',
    },
  });
}
