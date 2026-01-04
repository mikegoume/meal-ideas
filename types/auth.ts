import { Session } from '@supabase/supabase-js';

export type AuthData = {
  session?: Session | null;
  profile?: any | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  refetchProfile: () => Promise<void>;
};
