import { SwipeableCards } from '@/components/SwipeableCards';
import { sampleMeals } from '@/data/meals';
import { useAsyncStorage } from '@/hooks/useAsyncStorage';
import { Meal } from '@/types/meal';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [meals, setMeals] = useState(sampleMeals);

  const { storedValue: favoriteMeals, setValue: setFavoriteMeals } = useAsyncStorage<string[]>(
    'favoriteMeals',
    [],
  );

  const handleSwipeLeft = (meal: Meal) => {
    // Dislike - could implement a "disliked meals" list here
    console.log('Disliked:', meal.name);
  };

  const handleSwipeRight = async (meal: Meal) => {
    console.log('i am called');
    // Like - add to favorites and navigate to recipe
    const updatedFavorites = [...favoriteMeals];
    if (!updatedFavorites.includes(meal.id)) {
      updatedFavorites.push(meal.id);
      await setFavoriteMeals(updatedFavorites);
    }

    router.push(`/recipe/${meal.id}`);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1">
        <View className="px-6 ">
          <Text className="text-3xl font-bold text-gray-900">Meal Ideas</Text>
          <Text className="text-gray-600 text-lg">Swipe right to cook, left to skip</Text>
        </View>

        <View className="flex-1">
          {meals.length > 0 ? (
            <SwipeableCards
              meals={meals}
              setMeals={setMeals}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                No meals found
              </Text>
              <Text className="text-gray-600 text-center">
                Try adjusting your preferences in settings
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
