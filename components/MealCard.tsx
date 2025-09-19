import { Meal } from '@/types/meal';
import { Clock, Flame, Users } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface MealCardProps {
  meal: Meal;
  index: number;
  totalcards: number;
  panHandlers: any;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  nextCardScale: SharedValue<number>;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const ROTATION_RANGE = 15;

export function MealCard({
  meal,
  index,
  totalcards,
  panHandlers,
  translateX,
  translateY,
  nextCardScale,
}: MealCardProps) {
  const isTopCard = index === 0;
  const isSecondCard = index === 1;

  const leftOffset = useSharedValue(0);
  const cardScale = useSharedValue(isTopCard ? 1 : isSecondCard ? 0.9 : 0.8);
  const cardOpacity = useSharedValue(isTopCard ? 1 : isSecondCard ? 0.9 : 0.8);

  useEffect(() => {
    const targetOffset = isTopCard ? 10 : -25;
    leftOffset.value = withTiming(targetOffset, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
  }, [index, isTopCard, leftOffset]);

  useEffect(() => {
    const targetScale = isTopCard ? 1 : isSecondCard ? 0.8 : 0.7;
    cardScale.value = withTiming(targetScale, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });

    const targetOpacity = isTopCard ? 1 : isSecondCard ? 0.9 : 0;
    cardOpacity.value = withTiming(targetOpacity, {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
  }, [index, isTopCard, isSecondCard, cardScale, cardOpacity]);

  const animationStyle = useAnimatedStyle(() => {
    const currentX = isTopCard ? translateX.value : 0;
    const currentY = isTopCard ? translateY.value : 0;

    const rotate = interpolate(
      currentX,
      [-screenWidth / 2, 0, screenWidth / 2],
      [-ROTATION_RANGE, 0, ROTATION_RANGE],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      Math.sqrt(currentX ** 2 + currentY ** 2),
      [0, screenWidth / 2],
      [1, 0],
      Extrapolation.CLAMP,
    );

    const scale = isTopCard ? 1 : isSecondCard ? nextCardScale.value : 0.8;

    return {
      transform: [
        { translateX: currentX },
        { translateY: currentY },
        { rotate: `${rotate}deg` },
        { scale },
      ],
      opacity: isTopCard ? opacity : cardOpacity.value,
      zIndex: totalcards - index,
    };
  });

  return (
    <Animated.View style={[styles.card, animationStyle]} {...panHandlers}>
      <Image source={{ uri: meal.image }} style={styles.image} />

      <View className="absolute top-4 right-4">
        <View className="bg-black/20 px-3 py-1 rounded-full">
          <Text className="text-white text-sm font-semibold capitalize">{meal.difficulty}</Text>
        </View>
      </View>

      <View className="p-6 flex-1 flex-col gap-3">
        <Text className="text-2xl font-bold text-gray-900">{meal.name}</Text>

        <Text className="text-gray-600 text-base leading-6">{meal.description}</Text>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Clock size={16} color="#6b7280" />
            <Text className="text-gray-500 ml-2 text-sm">{meal.cookingTime} min</Text>
          </View>

          <View className="flex-row items-center">
            <Users size={16} color="#6b7280" />
            <Text className="text-gray-500 ml-2 text-sm">
              {meal.servings} serving{meal.servings > 1 ? 's' : ''}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Flame size={16} color="#6b7280" />
            <Text className="text-gray-500 ml-2 text-sm">{meal.calories} cal</Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {meal.tags.slice(0, 3).map((tag) => (
            <View key={tag} className="bg-orange-100 px-3 py-1 rounded-full">
              <Text className="text-orange-600 text-xs font-medium">#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.5,
    backgroundColor: 'white',
    borderRadius: 15,
    position: 'absolute',
    top: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
});
