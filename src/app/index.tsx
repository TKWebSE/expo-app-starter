import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/AppButton';
import { colors, spacing, typography } from '@/theme/tokens';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Text accessibilityRole="header" style={styles.title}>
          Expo App Starter
        </Text>
        <Text style={styles.description}>
          AndroidとWebで使えるアプリ基盤を準備しています。
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
    textAlign: 'center',
  },
});
