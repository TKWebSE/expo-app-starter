export const colors = {
  primary: '#2563EB',
  onPrimary: '#FFFFFF',
  background: '#F3F4F6',
  surface: '#FFFFFF',
  border: '#D1D5DB',
  text: '#1F2937',
  mutedText: '#6B7280',
  success: '#15803D',
  warning: '#A16207',
  error: '#B91C1C',
  info: '#0369A1',
} as const;

export type ThemeColors = {
  [Key in keyof typeof colors]: string;
};

export const darkColors: ThemeColors = {
  primary: '#60A5FA',
  onPrimary: '#0F172A',
  background: '#0F172A',
  surface: '#1E293B',
  border: '#475569',
  text: '#F8FAFC',
  mutedText: '#CBD5E1',
  success: '#4ADE80',
  warning: '#FACC15',
  error: '#F87171',
  info: '#38BDF8',
};

export const spacing = {
  1: 4,
  2: 8,
  4: 16,
  6: 24,
  8: 32,
  10: 40,
} as const;

export const radii = {
  control: 8,
  card: 12,
  dialog: 16,
} as const;

export const typography = {
  screenTitle: 24,
  sectionTitle: 20,
  body: 16,
  helper: 14,
  note: 12,
  button: 16,
} as const;
