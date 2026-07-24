import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppErrorState } from '@/components/ui/AppState';
import { colors, spacing } from '@/theme/tokens';

export default function ErrorScreen() {
  return (
    <View style={styles.container}>
      <AppErrorState onRetry={() => router.replace('/')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing[4],
  },
});
