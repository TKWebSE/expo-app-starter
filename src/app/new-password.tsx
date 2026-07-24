import { zodResolver } from '@hookform/resolvers/zod';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { z } from 'zod';

import { AppButton } from '@/components/ui/AppButton';
import { AppSnackbar } from '@/components/ui/AppSnackbar';
import { AppTextField } from '@/components/ui/AppTextField';
import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { newPasswordSchema } from '@/features/auth/schemas/authSchemas';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { colors, typography } from '@/theme/tokens';

type Form = z.infer<typeof newPasswordSchema>;

export default function NewPasswordScreen() {
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const error = useAuthStore((state) => state.error);
  const updatePassword = useAuthStore((state) => state.updatePassword);
  const clearError = useAuthStore((state) => state.clearError);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: '', passwordConfirmation: '' },
    mode: 'onBlur',
  });
  const submit = handleSubmit(async ({ password }) => {
    if (await updatePassword(password)) {
      router.replace({
        pathname: '/login',
        params: { notice: 'パスワードを更新しました' },
      });
    }
  });

  return (
    <>
      <AppSnackbar message={error} onClose={clearError} />
      <AuthScreen
        title="新しいパスワード"
        description="8〜64文字の新しいパスワードを設定してください"
        footer={
          <Link href="/reset-password" style={styles.link}>
            再設定メールをもう一度送る
          </Link>
        }
      >
        <Controller
          control={control}
          name="password"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppTextField
              autoComplete="new-password"
              editable={!isSubmitting}
              error={errors.password?.message}
              label="新しいパスワード"
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
              onSubmitEditing={() => void submit()}
              required
              secureTextEntry
              value={value}
            />
          )}
        />
        <AppButton
          label="パスワードを設定"
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
});
