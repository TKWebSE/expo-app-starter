import { colors, type ThemeColors } from '../../theme/tokens';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

export const SNACKBAR_DURATION_MS = 4_000;

export function snackbarColor(
  type: SnackbarType,
  palette: ThemeColors = colors,
): string {
  return palette[type];
}
