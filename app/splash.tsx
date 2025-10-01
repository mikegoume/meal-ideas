import { SplashScreen } from '@/components/SplashScreen';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function Splash() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();
  const [splashCompleted, setSplashCompleted] = useState(false);

  const handleAnimationComplete = () => {
    setSplashCompleted(true);
  };

  // Navigate after splash animation completes
  useEffect(() => {
    if (splashCompleted && !isLoading) {
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(authentication)/login');
      }
    }
  }, [splashCompleted, isLoading, isAuthenticated, router]);

  return <SplashScreen onAnimationComplete={handleAnimationComplete} />;
}
