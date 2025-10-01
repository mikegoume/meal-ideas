import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@meal_ideas_user';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Check for existing user on app start
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const removeUser = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data - replace with actual API response
      const userData: User = {
        id: '1',
        email: email,
        name: email.split('@')[0], // Use email prefix as name for demo
      };

      await saveUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  const loginWithGoogle = async () => {
    try {
      // TODO: Implement Google Sign-In
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData: User = {
        id: 'google_1',
        email: 'user@gmail.com',
        name: 'Google User',
      };

      await saveUser(userData);
    } catch (error) {
      console.error('Google login error:', error);
      throw new Error('Google login failed');
    }
  };

  const loginWithApple = async () => {
    try {
      // TODO: Implement Apple Sign-In
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData: User = {
        id: 'apple_1',
        email: 'user@icloud.com',
        name: 'Apple User',
      };

      await saveUser(userData);
    } catch (error) {
      console.error('Apple login error:', error);
      throw new Error('Apple login failed');
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const userData: User = {
        id: 'new_user',
        email: email,
        name: name || email.split('@')[0],
      };

      await saveUser(userData);
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Signup failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await removeUser();
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Logout failed');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    loginWithApple,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
