import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

import { getEnv } from '@/config/env';

const env = getEnv();
const isWebServer = Platform.OS === 'web' && typeof window === 'undefined';

export const supabase = createClient(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: isWebServer ? undefined : AsyncStorage,
      autoRefreshToken: !isWebServer,
      persistSession: !isWebServer,
      detectSessionInUrl: Platform.OS === 'web' && !isWebServer,
    },
  },
);
