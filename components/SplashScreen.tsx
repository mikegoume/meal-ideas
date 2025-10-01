import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate after 3 seconds
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onAnimationComplete]);

  return (
    <SafeAreaView className="flex-1 bg-orange-500">
      <View className="flex-1 justify-center items-center">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
          className="items-center">
          {/* Logo */}
          <View className="items-center mb-8">
            <Text className="text-6xl font-bold text-white mb-2">Meal</Text>
            <Text className="text-6xl font-bold text-white">Ideas</Text>
          </View>

          {/* Subtitle */}
          <Text className="text-white text-lg font-medium text-center opacity-90">
            Discover Amazing Recipes
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};
