import { colors } from '../../theme/tokens';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

export const SNACKBAR_DURATION_MS = 4_000;

export function snackbarColor(type: SnackbarType): string {
  return colors[type];
}
