import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/theme/tokens';

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>
        ページが見つかりません
      </Text>
      <Link href="/" style={styles.link}>
        ホームへ戻る
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[4],
    backgroundColor: colors.background,
    padding: spacing[6],
  },
  title: {
    color: colors.text,
    fontSize: typography.screenTitle,
    fontWeight: '700',
  },
  link: {
    color: colors.primary,
    fontSize: typography.body,
    minHeight: 44,
    paddingVertical: spacing[2],
  },
});
