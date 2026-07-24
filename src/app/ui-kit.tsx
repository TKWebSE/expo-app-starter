import { Redirect } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AppShell } from '@/components/layout/AppShell';
import { AppButton } from '@/components/ui/AppButton';
import { AppConfirmDialog } from '@/components/ui/AppConfirmDialog';
import { AppSnackbar } from '@/components/ui/AppSnackbar';
import {
  AppEmptyState,
  AppErrorState,
  AppLoadingState,
} from '@/components/ui/AppState';
import { AppTextField } from '@/components/ui/AppTextField';
import { getEnv } from '@/config/env';

export default function UiKitScreen() {
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const [dialog, setDialog] = useState(false);
  if (getEnv().EXPO_PUBLIC_APP_ENV === 'production')
    return <Redirect href="/" />;

  return (
    <AppShell title="UI部品確認">
      <Text>ボタン・入力・通知・ダイアログ・代表的な画面状態</Text>
      <AppButton
        label="通常ボタン"
        onPress={() => setSnackbar('操作が完了しました')}
      />
      <AppButton label="ダイアログを開く" onPress={() => setDialog(true)} />
      <AppTextField label="入力欄" placeholder="入力してください" />
      <View>
        <AppLoadingState />
      </View>
      <AppEmptyState
        message="最初のデータを作成してください"
        actionLabel="作成"
        onAction={() => undefined}
      />
      <AppErrorState onRetry={() => undefined} />
      <AppSnackbar
        message={snackbar}
        onClose={() => setSnackbar(null)}
        type="success"
      />
      <AppConfirmDialog
        visible={dialog}
        title="確認"
        message="この操作を実行しますか？"
        confirmLabel="実行"
        onCancel={() => setDialog(false)}
        onConfirm={() => setDialog(false)}
      />
    </AppShell>
  );
}
