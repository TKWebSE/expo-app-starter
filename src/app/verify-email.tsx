import { Link, Redirect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { AppButton } from '@/components/ui/AppButton';
import { AppSnackbar } from '@/components/ui/AppSnackbar';
import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { useThemePreference } from '@/theme/ThemeProvider';
import { spacing, type ThemeColors, typography } from '@/theme/tokens';

export default function VerifyEmailScreen() {
  const { colors } = useThemePreference();
  const styles = createStyles(colors);
  const email = useAuthStore((state) => state.pendingVerificationEmail);
  const [notice, setNotice] = useState<string | null>(null);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const resendAvailableAt = useAuthStore(
    (state) => state.verificationResendAvailableAt,
  );
  const error = useAuthStore((state) => state.error);
  const resend = useAuthStore((state) => state.resendVerification);
  const clearError = useAuthStore((state) => state.clearError);
  const closeNotice = useCallback(() => setNotice(null), []);
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    const initialTimer = setTimeout(() => setCurrentTime(Date.now()), 0);
    const timer = setInterval(() => setCurrentTime(Date.now()), 1_000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);
  const remainingSeconds = Math.max(
    0,
    Math.ceil(((resendAvailableAt ?? 0) - currentTime) / 1_000),
  );

  if (!email) {
    return <Redirect href="/signup" />;
  }

  return (
    <>
      <AppSnackbar
        message={notice ?? error}
        onClose={notice ? closeNotice : clearError}
        type={notice ? 'success' : 'error'}
      />
      <AuthScreen
        description="メール内のリンクを開いて登録を完了してください"
        footer={
          <Link href="/login" style={styles.link}>
            ログイン画面へ戻る
          </Link>
        }
        title="確認メールを送信しました"
      >
        <Text style={styles.label}>送信先</Text>
        <Text selectable style={styles.email}>
          {email}
        </Text>
        <Text style={styles.note}>
          メールが届かない場合は、迷惑メールフォルダも確認してください。
        </Text>
        <AppButton
          disabled={remainingSeconds > 0}
          label={
            remainingSeconds > 0
              ? `確認メールを再送（${remainingSeconds}秒後）`
              : '確認メールを再送'
          }
          loading={isSubmitting}
          onPress={async () => {
            if (await resend()) setNotice('確認メールを再送しました');
          }}
        />
      </AuthScreen>
    </>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    label: {
      color: colors.mutedText,
      fontSize: typography.helper,
    },
    email: {
      color: colors.text,
      fontSize: typography.body,
      fontWeight: '600',
    },
    note: {
      marginTop: spacing[2],
      color: colors.mutedText,
      fontSize: typography.helper,
    },
    link: {
      color: colors.primary,
      fontSize: typography.body,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
}
