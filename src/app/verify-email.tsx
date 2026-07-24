import { Link, Redirect } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { colors, spacing, typography } from '@/theme/tokens';

export default function VerifyEmailScreen() {
  const email = useAuthStore((state) => state.pendingVerificationEmail);

  if (!email) {
    return <Redirect href="/signup" />;
  }

  return (
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
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
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
