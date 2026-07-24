import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { AppButton } from '@/components/ui/AppButton';
import { AppSnackbar } from '@/components/ui/AppSnackbar';
import { AppTextField } from '@/components/ui/AppTextField';
import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { signupSchema } from '@/features/auth/schemas/authSchemas';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { colors, spacing, typography } from '@/theme/tokens';

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const error = useAuthStore((state) => state.error);
  const signUp = useAuthStore((state) => state.signUp);
  const clearError = useAuthStore((state) => state.clearError);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    const succeeded = await signUp({ email, password });
    if (succeeded) {
      router.replace('/verify-email');
    }
  });

  return (
    <View style={styles.page}>
      <AppSnackbar message={error} onClose={clearError} />
      <AuthScreen
        description="確認メールを受け取れるアドレスを使用してください"
        footer={
          <View style={styles.footer}>
            <Text style={styles.policy}>
              登録により、利用規約とプライバシーポリシーを確認したものとします
            </Text>
            <Link href="/login" style={styles.link}>
              ログイン画面へ戻る
            </Link>
          </View>
        }
        title="新規登録"
      >
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
              required
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppTextField
              autoComplete="new-password"
              editable={!isSubmitting}
              error={errors.password?.message}
              label="パスワード"
              onBlur={onBlur}
              onChangeText={onChange}
              required
              secureTextEntry
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="passwordConfirmation"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppTextField
              autoComplete="new-password"
              editable={!isSubmitting}
              error={errors.passwordConfirmation?.message}
              label="パスワード確認"
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={() => void onSubmit()}
              required
              secureTextEntry
              value={value}
            />
          )}
        />
        <AppButton
          disabled={isSubmitting}
          label="登録"
          loading={isSubmitting}
          onPress={() => void onSubmit()}
        />
      </AuthScreen>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  footer: {
    alignItems: 'center',
    gap: spacing[4],
  },
  policy: {
    color: colors.mutedText,
    fontSize: typography.note,
    textAlign: 'center',
  },
  link: {
    color: colors.primary,
    fontSize: typography.body,
    fontWeight: '600',
  },
});
