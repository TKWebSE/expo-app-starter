import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radii, spacing, typography } from '@/theme/tokens';

type AppConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel: string;
  danger?: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  visible: boolean;
};

export function AppConfirmDialog({
  cancelLabel = 'キャンセル',
  confirmLabel,
  danger = false,
  message,
  onCancel,
  onConfirm,
  title,
  visible,
}: AppConfirmDialogProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <View
          accessibilityRole="alert"
          accessibilityViewIsModal
          style={styles.dialog}
        >
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.cancelLabel}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={[
                styles.button,
                danger ? styles.dangerButton : styles.confirmButton,
              ]}
            >
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    padding: spacing[4],
  },
  dialog: {
    width: '100%',
    maxWidth: 440,
    gap: spacing[4],
    borderRadius: radii.dialog,
    backgroundColor: colors.surface,
    padding: spacing[6],
  },
  title: {
    color: colors.text,
    fontSize: typography.sectionTitle,
    fontWeight: '700',
  },
  message: {
    color: colors.mutedText,
    fontSize: typography.body,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[2],
  },
  button: {
    minWidth: 96,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.control,
    paddingHorizontal: spacing[4],
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  confirmButton: { backgroundColor: colors.primary },
  dangerButton: { backgroundColor: colors.error },
  cancelLabel: {
    color: colors.text,
    fontSize: typography.button,
    fontWeight: '600',
  },
  confirmLabel: {
    color: colors.onPrimary,
    fontSize: typography.button,
    fontWeight: '600',
  },
});
