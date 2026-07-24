import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppErrorState } from '@/components/ui/AppState';
import { useThemePreference } from '@/theme/ThemeProvider';
import { spacing, type ThemeColors } from '@/theme/tokens';

export default function ErrorScreen() {
  const { colors } = useThemePreference();
  const styles = createStyles(colors);
  return (
    <View style={styles.container}>
      <AppErrorState onRetry={() => router.replace('/')} />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: spacing[4],
    },
  });
}
