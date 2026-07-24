import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { useThemePreference } from '@/theme/ThemeProvider';
import { spacing, type ThemeColors, typography } from '@/theme/tokens';

export default function IndexScreen() {
  const { colors } = useThemePreference();
  const styles = createStyles(colors);
  const status = useAuthStore((state) => state.status);

  if (status === 'authenticated') {
    return <Redirect href="/home" />;
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text accessibilityRole="header" style={styles.title}>
          Expo App Starter
        </Text>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.description}>認証状態を確認しています</Text>
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
      textAlign: 'center',
    },
  });
}
