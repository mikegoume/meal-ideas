import { Meal } from '@/types/meal';
import React, { useRef } from 'react';
import { Dimensions, Image, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Easing, runOnJS, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { MealCard } from './MealCard';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;
const SWIPE_THRESHOLD = CARD_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;
const RESET_DURATION = 300;

interface SwipeableCardsProps {
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  onSwipeLeft: (meal: Meal) => void;
  onSwipeRight: (meal: Meal) => void;
}

export function SwipeableCards({
  meals,
  setMeals,
  onSwipeLeft,
  onSwipeRight,
}: SwipeableCardsProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const dummyTranslate = useSharedValue(0);
  const nextCardScale = useSharedValue(0.9);
  const nextCardOpacity = useSharedValue(0.7);

  const onSwipeComplete = () => {
    if (meals.length > 0) {
      setMeals((prev) => prev.slice(1));
      translateX.value = 0;
      translateY.value = 0;

      nextCardScale.value = 0.9;
      nextCardScale.value = withDelay(100, withTiming(0.9, { duration: 400, easing: Easing.exp }));
    } else {
      resetPosition();
    }
  };

  const handleLike = () => {
    forceSwipe('right');
    onSwipeRight(meals[0]);
  };

  const handleDislike = () => {
    forceSwipe('left');
    onSwipeLeft(meals[0]);
  };

  const forceSwipe = (direction: 'right' | 'left' | 'up' | 'down') => {
    const swipeConfig = {
      right: { x: screenWidth * 1.5, y: 0 },
      left: { x: -screenWidth * 1.5, y: 0 },
      up: { x: 0, y: -screenWidth * 1.5 },
      down: { x: 0, y: screenWidth * 1.5 },
    };

    translateX.value = withTiming(swipeConfig[direction].x, {
      duration: SWIPE_OUT_DURATION,
    });

    translateY.value = withTiming(
      swipeConfig[direction].y,
      {
        duration: SWIPE_OUT_DURATION,
      },
      () => runOnJS(onSwipeComplete)(),
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove(_, gestureState) {
        translateX.value = gestureState.dx;
        translateY.value = gestureState.dy;

        const dragDistance = Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2);
        const progress = Math.min(dragDistance / SWIPE_THRESHOLD, 1);
        nextCardScale.value = 0.9 + 0.1 * progress;
      },
      onPanResponderRelease(_, gestureState) {
        const absDx = Math.abs(gestureState.dx);
        const absDy = Math.abs(gestureState.dy);

        if (absDy > absDx) {
          if (gestureState.dy < -SWIPE_THRESHOLD) {
            forceSwipe('up');
          } else if (gestureState.dy > SWIPE_THRESHOLD) {
            forceSwipe('down');
          } else {
            resetPosition();
          }
        } else {
          if (gestureState.dx > SWIPE_THRESHOLD) {
            forceSwipe('right');
          } else if (gestureState.dx < -SWIPE_THRESHOLD) {
            forceSwipe('left');
          } else {
            resetPosition();
          }
        }
      },
    }),
  ).current;

  const resetPosition = () => {
    translateX.value = withTiming(0, { duration: RESET_DURATION });
    translateY.value = withTiming(0, { duration: RESET_DURATION });
    nextCardScale.value = withTiming(0.9, { duration: RESET_DURATION });
    nextCardOpacity.value = withTiming(0.7, { duration: RESET_DURATION });
  };

  const renderMeal = (meal: Meal, index: number) => {
    return (
      <MealCard
        key={index}
        meal={meal}
        index={index}
        totalcards={meals.length}
        panHandlers={index === 0 ? panResponder.panHandlers : dummyTranslate}
        nextCardScale={index === 0 ? nextCardScale : dummyTranslate}
        translateX={index === 0 ? translateX : dummyTranslate}
        translateY={index === 0 ? translateY : dummyTranslate}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>{meals.map(renderMeal).reverse()}</View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleDislike}>
          <Image source={require('../assets/images/icon.png')} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleLike}>
          <Image source={require('../assets/images/icon.png')} style={styles.image} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  btn: {
    backgroundColor: '#fff',
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: 25,
    height: 25,
  },
});
