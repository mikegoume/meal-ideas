import { getMeals } from '@/api/meals';
import { SwipeableCards } from '@/components/SwipeableCards';
import { Meal } from '@/types/meal';
import { useQuery } from '@tanstack/react-query';
import { Link, router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { bottom, top } = useSafeAreaInsets();

  const mealsQuery = useQuery({
    queryKey: ['meals'],
    queryFn: getMeals,
  });

  const meals = mealsQuery.data || [];

  // const { storedValue: favoriteMeals, setValue: setFavoriteMeals } = useAsyncStorage<string[]>(
  //   'favoriteMeals',
  //   [],
  // );

  const handleSwipeLeft = (meal: Meal) => {
    // Dislike - could implement a "disliked meals" list here
    console.log('Disliked: ', meal.name);
  };

  const handleSwipeRight = async (meal: Meal) => {
    // Like - add to favorites and navigate to recipe
    // const updatedFavorites = [...favoriteMeals];
    // if (!updatedFavorites.includes(meal.id)) {
    //   updatedFavorites.push(meal.id);
    //   await setFavoriteMeals(updatedFavorites);
    // }
    console.log('Liked: ', meal.name);
    router.push(`/recipe/${meal.id}`);
  };

  return (
    <View className="flex flex-1 bg-neutral-50" style={{ paddingTop: top, paddingBottom: bottom }}>
      <View className="flex-1">
        <View className="px-6">
          <Text className="text-3xl font-bold text-gray-900">Meal Ideas</Text>
          <Text className="text-gray-600 text-lg">Swipe right to cook, left to skip</Text>
        </View>

        <View className="flex-1">
          {meals.length > 0 ? (
            <SwipeableCards
              meals={meals}
              setMeals={() => {}}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                No meals found
              </Text>
              <Text className="text-gray-600 text-center">
                Try adjusting your preferences in
                <Link href="/settings" className="text-blue-500">
                  {' '}
                  settings
                </Link>
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
