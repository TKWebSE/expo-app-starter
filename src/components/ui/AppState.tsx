import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme/tokens';
import { AppButton } from './AppButton';

export function AppLoadingState({
  message = '読み込んでいます',
}: {
  message?: string;
}) {
  return (
    <View accessibilityLiveRegion="polite" style={styles.card}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

export function AppEmptyState({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>データがありません</Text>
      <Text style={styles.text}>{message}</Text>
      {actionLabel && onAction ? (
        <AppButton label={actionLabel} onPress={onAction} />
      ) : null}
    </View>
  );
}

export function AppErrorState({
  message = '時間をおいて、もう一度お試しください',
  onRetry,
}: {
  message?: string;
  onRetry: () => void;
}) {
  return (
    <View accessibilityRole="alert" style={styles.card}>
      <Text style={styles.title}>読み込みに失敗しました</Text>
      <Text style={styles.text}>{message}</Text>
      <AppButton label="再試行" onPress={onRetry} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: spacing[4],
    borderRadius: radii.card,
    backgroundColor: colors.surface,
    padding: spacing[6],
  },
  title: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: '700',
  },
  text: {
    color: colors.mutedText,
    fontSize: typography.body,
    textAlign: 'center',
  },
});
