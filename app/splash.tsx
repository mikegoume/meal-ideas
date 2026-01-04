import { SplashScreen } from '@/components/SplashScreen';
import { useAuthContext } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function Splash() {
  const router = useRouter();
  const [splashCompleted, setSplashCompleted] = useState(false);
  const { isLoading } = useAuthContext();

  const handleAnimationComplete = () => {
    setSplashCompleted(true);
  };

  // Navigate after splash animation completes
  useEffect(() => {
    if (splashCompleted && !isLoading) {
      router.replace('/(tabs)');
    }
  }, [splashCompleted, router, isLoading]);

  return <SplashScreen onAnimationComplete={handleAnimationComplete} />;
}
