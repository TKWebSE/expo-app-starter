import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { AppShell } from '@/components/layout/AppShell';
import { AppButton } from '@/components/ui/AppButton';
import { AppSnackbar } from '@/components/ui/AppSnackbar';
import { AppTextField } from '@/components/ui/AppTextField';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { useThemePreference } from '@/theme/ThemeProvider';
import { radii, spacing, type ThemeColors, typography } from '@/theme/tokens';

const schema = z.object({
  email: z.email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, '現在のパスワードを入力してください'),
});
type Form = z.infer<typeof schema>;

export default function ChangeEmailScreen() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const error = useAuthStore((state) => state.error);
  const updateEmail = useAuthStore((state) => state.updateEmail);
  const clearError = useAuthStore((state) => state.clearError);
  const { colors } = useThemePreference();
  const styles = createStyles(colors);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });
  if (status === 'unauthenticated') return <Redirect href="/login" />;

  const submit = handleSubmit(async ({ email, password }) => {
    if (email === user?.email) return;
    if (await updateEmail(email, password)) {
      router.replace({
        pathname: '/settings',
        params: {
          notice: '確認メールを送信しました。メール内のリンクを開いてください',
        },
      });
    }
  });

  return (
    <AppShell title="メールアドレス変更">
      <AppSnackbar message={error} onClose={clearError} />
      <View style={styles.card}>
        <Text style={styles.text}>現在：{user?.email}</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppTextField
              label="新しいメールアドレス"
              required
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              editable={!isSubmitting}
              error={errors.email?.message}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppTextField
              label="現在のパスワード"
              required
              secureTextEntry
              autoComplete="current-password"
              editable={!isSubmitting}
              error={errors.password?.message}
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={() => void submit()}
              value={value}
            />
          )}
        />
        <AppButton
          label="確認メールを送信"
          loading={isSubmitting}
          onPress={() => void submit()}
        />
      </View>
    </AppShell>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      gap: spacing[4],
      borderRadius: radii.card,
      backgroundColor: colors.surface,
      padding: spacing[6],
    },
    text: { color: colors.text, fontSize: typography.body },
  });
}
