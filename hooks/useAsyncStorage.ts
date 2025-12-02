import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  const loadStoredValue = useCallback(async () => {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    loadStoredValue();
  }, [loadStoredValue]);

  const setValue = async (value: T) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
    }
  };

  return { storedValue, setValue, loading };
}
