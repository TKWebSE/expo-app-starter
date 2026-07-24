import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemePreference } from '@/theme/ThemeProvider';
import { radii, spacing, type ThemeColors, typography } from '@/theme/tokens';

import {
  SNACKBAR_DURATION_MS,
  snackbarColor,
  type SnackbarType,
} from './snackbar';

type AppSnackbarProps = {
  message: string | null;
  onClose: () => void;
  type?: SnackbarType;
};

export function AppSnackbar({
  message,
  onClose,
  type = 'error',
}: AppSnackbarProps) {
  const { colors } = useThemePreference();
  const styles = createStyles(colors);
  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(onClose, SNACKBAR_DURATION_MS);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  return (
    <View
      accessibilityLiveRegion={type === 'error' ? 'assertive' : 'polite'}
      style={[
        styles.container,
        { backgroundColor: snackbarColor(type, colors) },
      ]}
    >
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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
}
