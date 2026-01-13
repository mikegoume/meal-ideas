import recipes from '@/assets/mock/recipes.json';
import { useAuthContext } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { IRecipe } from '@/types/recipe';
import { Heart, X } from 'lucide-react-native';
import React, { useCallback, useRef } from 'react';
import { Alert, Dimensions, PanResponder, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Easing, runOnJS, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { MealCard } from './MealCard';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;
const SWIPE_THRESHOLD = CARD_WIDTH * 0.25;
const SWIPE_OUT_DURATION = 250;
const RESET_DURATION = 300;

export function SwipeableCards() {
  const [meals, setMeals] = React.useState<IRecipe[]>(recipes.results);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { session } = useAuthContext();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const dummyTranslate = useSharedValue(0);
  const nextCardScale = useSharedValue(0.9);
  const nextCardOpacity = useSharedValue(0.7);

  const currentMeal = meals[0];

  // Handle card removal after swipe animation completes
  const removeCurrentCard = useCallback(() => {
    setMeals((prev) => prev.slice(1));
    setIsProcessing(false);

    // Reset animation values
    translateX.value = 0;
    translateY.value = 0;
    nextCardScale.value = 0.9;
    nextCardOpacity.value = 0.7;

    // Animate next card to full scale
    nextCardScale.value = withDelay(
      100,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) }),
    );
    nextCardOpacity.value = withDelay(100, withTiming(1, { duration: 300 }));
  }, [translateX, translateY, nextCardScale, nextCardOpacity]);

  const handleSwipeLeft = useCallback(async () => {
    // Dislike - could implement a "disliked meals" list here
    console.log('Disliked: ', currentMeal?.title);
  }, [currentMeal]);

  const handleSwipeRight = useCallback(
    async (recipeId: number) => {
      try {
        const { error } = await supabase.from('user_liked_recipes').insert({
          user_id: session?.user.id,
          recipe_id: recipeId,
        });

        if (error) {
          Alert.alert('Error', 'Failed to save liked recipe');
          console.error(error);
        }
      } catch (err) {
        console.error('Error saving recipe:', err);
      }
    },
    [session?.user.id],
  );

  const forceSwipe = useCallback(
    (direction: 'right' | 'left' | 'up' | 'down') => {
      if (isProcessing || meals.length === 0) return;

      setIsProcessing(true);

      const swipeConfig = {
        right: { x: screenWidth * 1.5, y: 0 },
        left: { x: -screenWidth * 1.5, y: 0 },
        up: { x: 0, y: -screenWidth * 1.5 },
        down: { x: 0, y: screenWidth * 1.5 },
      };

      // Animate next card scale during swipe
      nextCardScale.value = withTiming(1, {
        duration: SWIPE_OUT_DURATION,
        easing: Easing.out(Easing.ease),
      });

      nextCardOpacity.value = withTiming(1, {
        duration: SWIPE_OUT_DURATION,
      });

      translateX.value = withTiming(swipeConfig[direction].x, {
        duration: SWIPE_OUT_DURATION,
        easing: Easing.out(Easing.ease),
      });

      translateY.value = withTiming(
        swipeConfig[direction].y,
        {
          duration: SWIPE_OUT_DURATION,
          easing: Easing.out(Easing.ease),
        },
        () => runOnJS(removeCurrentCard)(),
      );
    },
    [
      isProcessing,
      meals.length,
      translateX,
      translateY,
      nextCardScale,
      nextCardOpacity,
      removeCurrentCard,
    ],
  );

  const handleLike = useCallback(() => {
    if (!currentMeal || isProcessing) return;

    handleSwipeRight(currentMeal.id);
    forceSwipe('right');
  }, [currentMeal, isProcessing, handleSwipeRight, forceSwipe]);

  const handleDislike = useCallback(() => {
    if (!currentMeal || isProcessing) return;

    handleSwipeLeft();
    forceSwipe('left');
  }, [currentMeal, isProcessing, handleSwipeLeft, forceSwipe]);

  const resetPosition = useCallback(() => {
    translateX.value = withTiming(0, { duration: RESET_DURATION });
    translateY.value = withTiming(0, { duration: RESET_DURATION });
    nextCardScale.value = withTiming(0.9, { duration: RESET_DURATION });
    nextCardOpacity.value = withTiming(0.7, { duration: RESET_DURATION });
  }, [translateX, translateY, nextCardScale, nextCardOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isProcessing && meals.length > 0,
      onMoveShouldSetPanResponder: () => !isProcessing && meals.length > 0,
      onPanResponderMove(_, gestureState) {
        translateX.value = gestureState.dx;
        translateY.value = gestureState.dy;

        const dragDistance = Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2);
        const progress = Math.min(dragDistance / SWIPE_THRESHOLD, 1);
        nextCardScale.value = 0.9 + 0.1 * progress;
        nextCardOpacity.value = 0.7 + 0.3 * progress;
      },
      onPanResponderRelease(_, gestureState) {
        const absDx = Math.abs(gestureState.dx);
        const absDy = Math.abs(gestureState.dy);

        // Determine swipe direction
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
            // Swipe right = like
            handleSwipeRight(currentMeal.id);
            forceSwipe('right');
          } else if (gestureState.dx < -SWIPE_THRESHOLD) {
            // Swipe left = dislike
            handleSwipeLeft();
            forceSwipe('left');
          } else {
            resetPosition();
          }
        }
      },
    }),
  ).current;

  const renderMeal = (meal: IRecipe, index: number) => {
    if (index > 1) return null; // Only render current and next card for performance

    return (
      <MealCard
        key={meal.id}
        meal={meal}
        index={index}
        totalcards={meals.length}
        panHandlers={index === 0 ? panResponder.panHandlers : undefined}
        nextCardScale={index === 1 ? nextCardScale : dummyTranslate}
        nextCardOpacity={index === 1 ? nextCardOpacity : dummyTranslate}
        translateX={index === 0 ? translateX : dummyTranslate}
        translateY={index === 0 ? translateY : dummyTranslate}
      />
    );
  };

  if (meals.length === 0) {
    return (
      <View className="flex flex-1 justify-center items-center">
        {/* Add your empty state component here */}
      </View>
    );
  }

  return (
    <View className="flex flex-1">
      <View className="flex flex-col justify-center items-center">
        {meals.slice(0, 2).map(renderMeal).reverse()}
      </View>
      <View className="absolute bottom-0 flex-row w-full justify-evenly pb-8">
        <TouchableOpacity
          style={[styles.btn, isProcessing && styles.btnDisabled]}
          onPress={handleDislike}
          disabled={isProcessing}>
          <X size={32} color={isProcessing ? '#ccc' : '#000'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, isProcessing && styles.btnDisabled]}
          onPress={handleLike}
          disabled={isProcessing}>
          <Heart size={32} color={isProcessing ? '#ccc' : '#FF6B6B'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  btnDisabled: {
    opacity: 0.5,
  },
});
