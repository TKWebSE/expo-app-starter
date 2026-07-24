import { Redirect } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { colors, spacing, typography } from '@/theme/tokens';

export default function HomeScreen() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);

  if (status === 'unauthenticated') {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text accessibilityRole="header" style={styles.title}>
          ホーム
        </Text>
        <Text style={styles.description}>ログインできました。</Text>
        <Text selectable style={styles.email}>
          {user?.email}
        </Text>
        <AppButton label="動作確認" onPress={() => undefined} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
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
