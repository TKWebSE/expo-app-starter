import { Redirect, router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { AppButton } from '@/components/ui/AppButton';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { useThemePreference } from '@/theme/ThemeProvider';
import { spacing, type ThemeColors, typography } from '@/theme/tokens';

export default function HomeScreen() {
  const { colors } = useThemePreference();
  const styles = createStyles(colors);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  if (status === 'unauthenticated') {
    return <Redirect href="/login" />;
  }

  return (
    <AppShell title="ホーム">
      <View style={styles.container}>
        <Text style={styles.title}>ようこそ</Text>
        <Text style={styles.description}>
          認証とアプリ基盤は正常に動作しています。
        </Text>
        <Text selectable style={styles.email}>
          {user?.email}
        </Text>
        <AppButton
          label="設定を開く"
          onPress={() => router.push('/settings')}
        />
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>Repository 接続サンプル</Text>
        <Text style={styles.description}>
          プロフィール画面でSupabaseとの取得・更新を確認できます。
        </Text>
      </View>
    </AppShell>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      alignItems: 'flex-start',
      gap: spacing[4],
      padding: spacing[6],
    },
    card: {
      gap: spacing[2],
      borderRadius: 12,
      backgroundColor: colors.surface,
      padding: spacing[6],
    },
    title: {
      color: colors.text,
      fontSize: typography.screenTitle,
      fontWeight: '700',
    },
    description: {
      color: colors.mutedText,
      fontSize: typography.body,
    },
    email: {
      color: colors.text,
      fontSize: typography.body,
    },
  });
}
