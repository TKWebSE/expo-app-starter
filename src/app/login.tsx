import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { AppButton } from '@/components/ui/AppButton';
import { AppSnackbar } from '@/components/ui/AppSnackbar';
import { AppTextField } from '@/components/ui/AppTextField';
import { AuthScreen } from '@/features/auth/components/AuthScreen';
import { loginSchema } from '@/features/auth/schemas/authSchemas';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { useThemePreference } from '@/theme/ThemeProvider';
import { spacing, type ThemeColors, typography } from '@/theme/tokens';

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { colors } = useThemePreference();
  const styles = createStyles(colors);
  const params = useLocalSearchParams<{ notice?: string }>();
  const [showsPassword, setShowsPassword] = useState(false);
  const status = useAuthStore((state) => state.status);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const error = useAuthStore((state) => state.error);
  const signIn = useAuthStore((state) => state.signIn);
  const clearError = useAuthStore((state) => state.clearError);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  if (status === 'authenticated') {
    return <Redirect href="/home" />;
  }

  const onSubmit = handleSubmit(async (values) => {
    const succeeded = await signIn(values);
    if (succeeded) {
      router.replace('/home');
    }
  });

  return (
    <View style={styles.page}>
      <AppSnackbar
        message={params.notice ?? null}
        onClose={() => router.setParams({ notice: '' })}
        type="success"
      />
      <AppSnackbar message={error} onClose={clearError} />
      <AuthScreen
        description="メールアドレスとパスワードを入力してください"
        footer={
          <View style={styles.links}>
            <Link href="/signup" style={styles.link}>
              新規登録
            </Link>
            <Link href="/reset-password" style={styles.link}>
              パスワードを忘れた方
            </Link>
          </View>
        }
        title="ログイン"
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
              autoComplete="current-password"
              editable={!isSubmitting}
              error={errors.password?.message}
              label="パスワード"
              onBlur={onBlur}
              onChangeText={onChange}
              onSubmitEditing={() => void onSubmit()}
              required
              secureTextEntry={!showsPassword}
              value={value}
            />
          )}
        />
        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={() => setShowsPassword((value) => !value)}
          style={styles.passwordToggle}
        >
          <Text style={styles.link}>
            パスワードを{showsPassword ? '隠す' : '表示'}
          </Text>
        </Pressable>
        <AppButton
          disabled={isSubmitting}
          label="ログイン"
          loading={isSubmitting}
          onPress={() => void onSubmit()}
        />
      </AuthScreen>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    page: { flex: 1 },
    links: {
      alignItems: 'center',
      gap: spacing[2],
    },
    link: {
      color: colors.primary,
      fontSize: typography.body,
      fontWeight: '600',
    },
    passwordToggle: {
      minHeight: 44,
      alignSelf: 'flex-end',
      justifyContent: 'center',
    },
  });
}
