import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const SUPABASE_URL = (Constants.expoConfig?.extra as any)?.SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = (Constants.expoConfig?.extra as any)?.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});
