import { router, usePathname } from 'expo-router';
import type { PropsWithChildren } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePreference } from '@/theme/ThemeProvider';
import { radii, spacing, type ThemeColors, typography } from '@/theme/tokens';

type Props = PropsWithChildren<{ title: string; scroll?: boolean }>;
const nav = [
  { href: '/home' as const, icon: '⌂', label: 'ホーム' },
  { href: '/settings' as const, icon: '⚙', label: '設定' },
];

export function AppShell({ children, title, scroll = true }: Props) {
  const { colors } = useThemePreference();
  const styles = createStyles(colors);
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const wide = width >= 768;
  const content = <View style={styles.content}>{children}</View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.row}>
        {wide ? (
          <View style={styles.sidebar}>
            <Text style={styles.brand}>Expo App Starter</Text>
            <View style={styles.navList}>
              {nav.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  active={pathname === item.href}
                  colors={colors}
                />
              ))}
            </View>
            <Text style={styles.version}>v0.1.0</Text>
          </View>
        ) : null}
        <View style={styles.main}>
          <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.title}>
              {title}
            </Text>
          </View>
          {scroll ? (
            <ScrollView contentContainerStyle={styles.scroll}>
              {content}
            </ScrollView>
          ) : (
            content
          )}
          {!wide ? (
            <View style={styles.bottomNav}>
              {nav.map((item) => (
                <NavItem
                  key={item.href}
                  {...item}
                  active={pathname === item.href}
                  compact
                  colors={colors}
                />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

function NavItem({
  active,
  compact,
  href,
  icon,
  label,
  colors,
}: {
  active: boolean;
  compact?: boolean;
  href: '/home' | '/settings';
  icon: string;
  label: string;
  colors: ThemeColors;
}) {
  const styles = createStyles(colors);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={() => router.replace(href)}
      style={[
        styles.navItem,
        compact && styles.navCompact,
        active && styles.navActive,
      ]}
    >
      <Text style={[styles.navText, active && styles.navTextActive]}>
        {icon} {label}
      </Text>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    row: { flex: 1, flexDirection: 'row' },
    sidebar: {
      width: 240,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      backgroundColor: colors.surface,
      padding: spacing[6],
    },
    brand: {
      color: colors.text,
      fontSize: typography.sectionTitle,
      fontWeight: '800',
    },
    navList: { flex: 1, gap: spacing[2], paddingTop: spacing[8] },
    version: { color: colors.mutedText, fontSize: typography.note },
    main: { flex: 1 },
    header: {
      minHeight: 56,
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing[6],
    },
    title: {
      color: colors.text,
      fontSize: typography.screenTitle,
      fontWeight: '700',
    },
    scroll: { flexGrow: 1 },
    content: {
      width: '100%',
      maxWidth: 1200,
      alignSelf: 'center',
      padding: spacing[6],
      gap: spacing[4],
    },
    bottomNav: {
      minHeight: 64,
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.surface,
    },
    navItem: {
      minHeight: 44,
      justifyContent: 'center',
      borderRadius: radii.control,
      paddingHorizontal: spacing[4],
    },
    navCompact: { flex: 1, alignItems: 'center', borderRadius: 0 },
    navActive: { backgroundColor: colors.primary + '26' },
    navText: {
      color: colors.mutedText,
      fontSize: typography.helper,
      fontWeight: '600',
    },
    navTextActive: { color: colors.primary },
  });
}
