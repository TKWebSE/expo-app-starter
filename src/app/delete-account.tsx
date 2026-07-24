import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

import { AppShell } from '@/components/layout/AppShell';
import { AppButton } from '@/components/ui/AppButton';
import { AppConfirmDialog } from '@/components/ui/AppConfirmDialog';
import { AppSnackbar } from '@/components/ui/AppSnackbar';
import { AppTextField } from '@/components/ui/AppTextField';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { useThemePreference } from '@/theme/ThemeProvider';
import { radii, spacing, type ThemeColors, typography } from '@/theme/tokens';

type Form = { password: string; confirmation: string };

export default function DeleteAccountScreen() {
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const isSubmitting = useAuthStore((state) => state.isSubmitting);
  const error = useAuthStore((state) => state.error);
  const deleteAccount = useAuthStore((state) => state.deleteAccount);
  const clearError = useAuthStore((state) => state.clearError);
  const [confirmsDeletion, setConfirmsDeletion] = useState(false);
  const { colors } = useThemePreference();
  const styles = createStyles(colors);
  const schema = useMemo(
    () =>
      z.object({
        password: z.string().min(1, '現在のパスワードを入力してください'),
        confirmation: z.string().refine((value) => value === user?.email, {
          message: '確認用メールアドレスが一致しません',
        }),
      }),
    [user?.email],
  );
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmation: '' },
    mode: 'onBlur',
  });

  if (status === 'unauthenticated') return <Redirect href="/login" />;
  const requestDeletion = handleSubmit(() => setConfirmsDeletion(true));
  const confirmDeletion = async () => {
    setConfirmsDeletion(false);
    if (await deleteAccount(getValues('password'))) {
      router.replace({
        pathname: '/login',
        params: { notice: 'アカウントを削除しました' },
      });
    }
  };

  return (
    <AppShell title="アカウント削除">
      <AppSnackbar message={error} onClose={clearError} />
      <View style={styles.warning}>
        <Text style={styles.title}>この操作は取り消せません</Text>
        <Text style={styles.text}>
          アカウントとプロフィールを完全に削除し、現在の端末からログアウトします。
        </Text>
      </View>
      <View style={styles.card}>
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
              value={value}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmation"
          render={({ field: { onBlur, onChange, value } }) => (
            <AppTextField
              label="確認用メールアドレス"
              required
              autoCapitalize="none"
              inputMode="email"
              editable={!isSubmitting}
              error={errors.confirmation?.message}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={user?.email}
            />
          )}
        />
        <AppButton
          label="アカウントを削除"
          loading={isSubmitting}
          onPress={() => void requestDeletion()}
        />
      </View>
      <AppConfirmDialog
        visible={confirmsDeletion}
        danger
        title="本当に削除しますか？"
        message="アカウントとプロフィールは復元できません。"
        confirmLabel="完全に削除"
        onCancel={() => setConfirmsDeletion(false)}
        onConfirm={() => void confirmDeletion()}
      />
    </AppShell>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    warning: {
      gap: spacing[2],
      borderWidth: 1,
      borderColor: colors.error,
      borderRadius: radii.card,
      padding: spacing[4],
    },
    card: {
      gap: spacing[4],
      borderRadius: radii.card,
      backgroundColor: colors.surface,
      padding: spacing[6],
    },
    title: {
      color: colors.error,
      fontSize: typography.sectionTitle,
      fontWeight: '700',
    },
    text: { color: colors.text, fontSize: typography.body },
  });
}
