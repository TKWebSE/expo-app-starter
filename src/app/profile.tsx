import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Redirect, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';

import { AppButton } from '@/components/ui/AppButton';
import { AppConfirmDialog } from '@/components/ui/AppConfirmDialog';
import { AppSnackbar } from '@/components/ui/AppSnackbar';
import { AppTextField } from '@/components/ui/AppTextField';
import { useAuthStore } from '@/features/auth/stores/AuthProvider';
import { SupabaseProfileRepository } from '@/features/profile/repositories/SupabaseProfileRepository';
import { profileSchema } from '@/features/profile/schemas/profileSchema';
import {
  hasUnsavedDisplayName,
  loadProfile,
  saveDisplayName,
} from '@/features/profile/utils/profileWorkflow';
import { useThemePreference } from '@/theme/ThemeProvider';
import { radii, spacing, type ThemeColors, typography } from '@/theme/tokens';

type ProfileForm = z.infer<typeof profileSchema>;

const profileRepository = new SupabaseProfileRepository();

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'プロフィールを処理できませんでした';
}

export default function ProfileScreen() {
  const { colors } = useThemePreference();
  const styles = createStyles(colors);
  const [notification, setNotification] = useState<string | null>(null);
  const [dismissedLoadError, setDismissedLoadError] = useState(false);
  const [confirmsDiscard, setConfirmsDiscard] = useState(false);
  const status = useAuthStore((state) => state.status);
  const user = useAuthStore((state) => state.user);
  const closeNotification = useCallback(() => {
    setNotification(null);
    setDismissedLoadError(true);
  }, []);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: '' },
    mode: 'onBlur',
  });
  const currentDisplayName = useWatch({ control, name: 'displayName' });

  const profileQuery = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => loadProfile(profileRepository, user!.id),
    enabled: Boolean(user?.id),
  });
  const saveMutation = useMutation({
    mutationFn: (displayName: string) =>
      saveDisplayName(profileRepository, user!.id, displayName),
    onSuccess: () => {
      router.replace({
        pathname: '/settings',
        params: { notice: 'プロフィールを保存しました' },
      });
    },
    onError: (error) => setNotification(errorMessage(error)),
  });

  useEffect(() => {
    if (profileQuery.data) {
      reset({ displayName: profileQuery.data.displayName });
    }
  }, [profileQuery.data, reset]);

  if (status === 'unauthenticated') {
    return <Redirect href="/login" />;
  }

  const hasChanges = hasUnsavedDisplayName(
    profileQuery.data?.displayName ?? '',
    currentDisplayName,
  );
  const requestBack = () => {
    if (hasChanges) {
      setConfirmsDiscard(true);
    } else {
      router.back();
    }
  };
  const onSubmit = handleSubmit(({ displayName }) => {
    saveMutation.mutate(displayName);
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppSnackbar
        message={
          notification ??
          (!dismissedLoadError && profileQuery.error
            ? errorMessage(profileQuery.error)
            : null)
        }
        onClose={closeNotification}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Pressable
              accessibilityLabel="設定へ戻る"
              accessibilityRole="button"
              onPress={requestBack}
              style={styles.back}
            >
              <Text style={styles.link}>戻る</Text>
            </Pressable>
            <Text accessibilityRole="header" style={styles.title}>
              プロフィール
            </Text>
          </View>

          <View style={styles.card}>
            {profileQuery.isPending ? (
              <Text accessibilityLiveRegion="polite" style={styles.helper}>
                プロフィールを読み込んでいます
              </Text>
            ) : (
              <>
                <Controller
                  control={control}
                  name="displayName"
                  render={({ field: { onBlur, onChange, value } }) => (
                    <AppTextField
                      editable={!saveMutation.isPending}
                      error={errors.displayName?.message}
                      label="表示名"
                      maxLength={51}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      onSubmitEditing={() => void onSubmit()}
                      required
                      value={value}
                    />
                  )}
                />
                <AppTextField
                  editable={false}
                  label="メールアドレス"
                  value={user?.email ?? ''}
                />
                <AppButton
                  disabled={!hasChanges || saveMutation.isPending}
                  label="保存"
                  loading={saveMutation.isPending}
                  onPress={() => void onSubmit()}
                />
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <AppConfirmDialog
        confirmLabel="破棄"
        danger
        message="保存していない表示名の変更を破棄しますか？"
        onCancel={() => setConfirmsDiscard(false)}
        onConfirm={() => router.back()}
        title="変更を破棄しますか？"
        visible={confirmsDiscard}
      />
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1 },
    safeArea: { flex: 1, backgroundColor: colors.background },
    content: {
      width: '100%',
      maxWidth: 720,
      alignSelf: 'center',
      gap: spacing[4],
      padding: spacing[4],
    },
    header: { gap: spacing[2] },
    back: {
      minHeight: 44,
      alignSelf: 'flex-start',
      justifyContent: 'center',
    },
    link: {
      color: colors.primary,
      fontSize: typography.body,
      fontWeight: '600',
    },
    title: {
      color: colors.text,
      fontSize: typography.screenTitle,
      fontWeight: '700',
    },
    card: {
      gap: spacing[4],
      borderRadius: radii.card,
      backgroundColor: colors.surface,
      padding: spacing[6],
    },
    helper: { color: colors.mutedText, fontSize: typography.body },
  });
}
