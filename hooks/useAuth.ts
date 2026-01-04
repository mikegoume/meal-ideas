import { AuthData } from '@/types/auth';
import { createContext, useContext } from 'react';

export const AuthContext = createContext<AuthData>({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
  refetchProfile: () => {},
});

export const useAuthContext = () => useContext(AuthContext);
