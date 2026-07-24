import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme/tokens';

type AppSnackbarProps = {
  message: string | null;
  onClose: () => void;
};

export function AppSnackbar({ message, onClose }: AppSnackbarProps) {
  if (!message) {
    return null;
  }

  return (
    <View accessibilityLiveRegion="assertive" style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      <Pressable
        accessibilityLabel="通知を閉じる"
        accessibilityRole="button"
        hitSlop={8}
        onPress={onClose}
        style={styles.close}
      >
        <Text style={styles.closeLabel}>閉じる</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    left: spacing[4],
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    borderRadius: radii.control,
    backgroundColor: colors.error,
    padding: spacing[4],
  },
  message: {
    flex: 1,
    color: colors.onPrimary,
    fontSize: typography.helper,
  },
  close: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLabel: {
    color: colors.onPrimary,
    fontSize: typography.helper,
    fontWeight: '700',
  },
});
