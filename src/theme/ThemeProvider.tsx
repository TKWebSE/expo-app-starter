import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

import { colors as lightColors, darkColors, type ThemeColors } from './tokens';

export type ThemePreference = 'system' | 'light' | 'dark';
type ThemeContextValue = {
  colors: ThemeColors;
  preference: ThemePreference;
  resolved: 'light' | 'dark';
  ready: boolean;
  setPreference: (value: ThemePreference) => void;
};

const STORAGE_KEY = 'expo-app-starter.theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (value === 'light' || value === 'dark' || value === 'system') {
          setPreferenceState(value);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const setPreference = (value: ThemePreference) => {
    setPreferenceState(value);
    void AsyncStorage.setItem(STORAGE_KEY, value);
  };
  const resolved: 'light' | 'dark' =
    preference === 'system'
      ? system === 'dark'
        ? 'dark'
        : 'light'
      : preference;
  const value = useMemo(
    () => ({
      colors: resolved === 'dark' ? darkColors : lightColors,
      preference,
      resolved,
      ready,
      setPreference,
    }),
    [preference, resolved, ready],
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemePreference(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error('useThemePreferenceはThemeProvider内で使用してください');
  return context;
}
