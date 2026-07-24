import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

import { useThemePreference } from '@/theme/ThemeProvider';
import { radii, spacing, type ThemeColors, typography } from '@/theme/tokens';

type AppTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  required?: boolean;
};

export function AppTextField({
  error,
  label,
  required = false,
  ...props
}: AppTextFieldProps) {
  const { colors } = useThemePreference();
  const styles = createStyles(colors);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? '（必須）' : ''}
      </Text>
      <TextInput
        accessibilityLabel={label}
        accessibilityState={{ disabled: props.editable === false }}
        style={[styles.input, error && styles.inputError]}
        {...props}
      />
      {error ? (
        <Text accessibilityLiveRegion="polite" style={styles.error}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      gap: spacing[1],
    },
    label: {
      color: colors.text,
      fontSize: typography.helper,
      fontWeight: '600',
    },
    input: {
      minHeight: 44,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.control,
      backgroundColor: colors.surface,
      color: colors.text,
      fontSize: typography.body,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
    },
    inputError: {
      borderColor: colors.error,
    },
    error: {
      color: colors.error,
      fontSize: typography.helper,
    },
  });
}
