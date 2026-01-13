import { Session } from '@supabase/supabase-js';
import { IProfile } from './profile';

export type AuthData = {
  session?: Session | null;
  profile?: IProfile | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  refetchProfile: () => Promise<void>;
};
