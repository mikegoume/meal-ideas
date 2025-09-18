import { Meal } from '@/types/meal';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { MealCard } from './MealCard';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;
const SWIPE_THRESHOLD = CARD_WIDTH * 0.25;

interface SwipeableCardsProps {
  meals: Meal[];
  onSwipeLeft: (meal: Meal) => void;
  onSwipeRight: (meal: Meal) => void;
}

export function SwipeableCards({ meals, onSwipeLeft, onSwipeRight }: SwipeableCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const nextCardScale = useSharedValue(0.9);
  const nextCardOpacity = useSharedValue(0.7);

  const handleSwipe = (isLeft: boolean) => {
    const meal = meals[currentIndex];
    if (!meal) return;

    if (isLeft) {
      onSwipeLeft(meal);
    } else {
      onSwipeRight(meal);
    }

    // Move to next card and reset animations
    setCurrentIndex((prev) => prev + 1);
    translateX.value = 0;
    translateY.value = 0;
    rotate.value = 0;
    scale.value = 1;
    nextCardScale.value = 0.9;
    nextCardOpacity.value = 0.7;
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1.05);
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.1;
      rotate.value = interpolate(
        event.translationX,
        [-screenWidth / 2, 0, screenWidth / 2],
        [-15, 0, 15],
      );

      const progress = Math.abs(event.translationX) / SWIPE_THRESHOLD;
      nextCardScale.value = interpolate(progress, [0, 1], [0.9, 0.95]);
      nextCardOpacity.value = interpolate(progress, [0, 1], [0.7, 0.9]);
    })
    .onEnd((event) => {
      const shouldSwipeLeft = event.translationX < -SWIPE_THRESHOLD;
      const shouldSwipeRight = event.translationX > SWIPE_THRESHOLD;

      if (shouldSwipeLeft || shouldSwipeRight) {
        const targetX = shouldSwipeLeft ? -screenWidth * 1.5 : screenWidth * 1.5;

        translateX.value = withTiming(targetX, { duration: 300 });
        translateY.value = withTiming(event.translationY * 0.2, { duration: 300 });
        rotate.value = withTiming(shouldSwipeLeft ? -30 : 30, { duration: 300 });
        scale.value = withTiming(0.8, { duration: 300 });

        // Pass boolean into JS safely
        runOnJS(handleSwipe)(shouldSwipeLeft);
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotate.value = withSpring(0);
        scale.value = withSpring(1);
        nextCardScale.value = withSpring(0.9);
        nextCardOpacity.value = withSpring(0.7);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nextCardScale.value }],
    opacity: nextCardOpacity.value,
  }));

  if (currentIndex >= meals.length) {
    return (
      <View style={styles.container}>
        <View style={styles.doneBox}>
          <Text style={styles.doneTitle}>🎉 All done!</Text>
          <Text style={styles.doneSubtitle}>You&apos;ve seen all available meals</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Next card (background) */}
      {currentIndex + 1 < meals.length && (
        <Animated.View style={[styles.nextCard, nextCardStyle]}>
          <MealCard meal={meals[currentIndex + 1]} />
        </Animated.View>
      )}

      {/* Current card (foreground) */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.currentCard, cardStyle]}>
          <MealCard meal={meals[currentIndex]} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6', // soft gray bg
  },
  currentCard: {
    zIndex: 2,
  },
  nextCard: {
    position: 'absolute',
    zIndex: 1,
  },
  doneBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  doneTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  doneSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
  },
});
