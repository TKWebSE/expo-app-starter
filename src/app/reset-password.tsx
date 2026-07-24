import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';
import { z } from 'zod';

import { AppButton } from '@/components/ui/AppButton';
import { AppSnackbar } from '@/components/ui/AppSnackbar';
import { AppTextField } from '@/components/ui/AppTextField';
import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { resetPasswordSchema } from '@/features/auth/schemas/authSchemas';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { colors, spacing, typography } from '@/theme/tokens';

type Form = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordScreen() {
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const error = useAuthStore((state) => state.error);
  const sendPasswordReset = useAuthStore((state) => state.sendPasswordReset);
  const clearError = useAuthStore((state) => state.clearError);
  const closeNotice = useCallback(() => setNotice(null), []);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  const submit = handleSubmit(async ({ email }) => {
    if (await sendPasswordReset(email)) {
      setSentEmail(email);
      setNotice('パスワード再設定メールを送信しました');
    }
  });

  return (
    <>
      <AppSnackbar
        message={notice ?? error}
        onClose={notice ? closeNotice : clearError}
        type={notice ? 'success' : 'error'}
      />
      <AuthScreen
        title="パスワード再設定"
        description="登録したメールアドレスへ再設定リンクを送信します"
        footer={
          <Link href="/login" style={styles.link}>
            ログイン画面へ戻る
          </Link>
        }
      >
        {sentEmail ? (
          <Text accessibilityLiveRegion="polite" style={styles.notice}>
            {sentEmail} に送信しました。メール内のリンクを開いてください。
          </Text>
        ) : null}
        <Controller
          control={control}
          name="email"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppTextField
              autoCapitalize="none"
              autoComplete="email"
              editable={!isSubmitting}
              error={errors.email?.message}
              inputMode="email"
              label="メールアドレス"
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={() => void submit()}
              required
              value={value}
            />
          )}
        />
        <AppButton
          label="再設定メールを送信"
          loading={isSubmitting}
          onPress={() => void submit()}
        />
      </AuthScreen>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '600',
    textAlign: 'center',
  },
  notice: {
    color: colors.success,
    fontSize: typography.helper,
    marginBottom: spacing[2],
  },
});
