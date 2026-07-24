import { router } from 'expo-router';
import type { PropsWithChildren } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePreference } from '@/theme/ThemeProvider';
import { radii, spacing, type ThemeColors, typography } from '@/theme/tokens';

type LegalDocumentProps = PropsWithChildren<{
  title: string;
  updatedAt: string;
}>;

export function LegalDocument({
  children,
  title,
  updatedAt,
}: LegalDocumentProps) {
  const { colors } = useThemePreference();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.back}
        >
          <Text style={styles.backText}>‹ 戻る</Text>
        </Pressable>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.updatedAt}>最終更新日：{updatedAt}</Text>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            このページはアプリ用のひな形です。公開前に運営者情報、連絡先、準拠法などを実態に合わせて確定してください。
          </Text>
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function LegalSection({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  const { colors } = useThemePreference();
  const styles = createStyles(colors);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.body}>{children}</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: {
      alignItems: 'center',
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      minHeight: 56,
      paddingHorizontal: spacing[4],
    },
    back: {
      justifyContent: 'center',
      minHeight: 44,
      minWidth: 72,
    },
    backText: {
      color: colors.primary,
      fontSize: typography.body,
      fontWeight: '600',
    },
    headerTitle: {
      color: colors.text,
      flex: 1,
      fontSize: typography.sectionTitle,
      fontWeight: '700',
      marginRight: 72,
      textAlign: 'center',
    },
    content: {
      alignSelf: 'center',
      gap: spacing[6],
      maxWidth: 760,
      padding: spacing[6],
      width: '100%',
    },
    title: {
      color: colors.text,
      fontSize: typography.screenTitle,
      fontWeight: '700',
    },
    updatedAt: { color: colors.mutedText, fontSize: typography.helper },
    notice: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radii.card,
      borderWidth: 1,
      padding: spacing[4],
    },
    noticeText: {
      color: colors.mutedText,
      fontSize: typography.helper,
      lineHeight: 21,
    },
    section: { gap: spacing[2] },
    sectionTitle: {
      color: colors.text,
      fontSize: typography.sectionTitle,
      fontWeight: '700',
    },
    body: { color: colors.text, fontSize: typography.body, lineHeight: 26 },
  });
}
