import { SwipeableCards } from '@/components/SwipeableCards';
import { sampleMeals } from '@/data/meals';
import { useAsyncStorage } from '@/hooks/useAsyncStorage';
import { Meal, UserPreferences } from '@/types/meal';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { storedValue: preferences } = useAsyncStorage<UserPreferences>('userPreferences', {
    selectedRoles: [],
    selectedAims: [],
  });

  const { storedValue: favoriteMeals, setValue: setFavoriteMeals } = useAsyncStorage<string[]>('favoriteMeals', []);

  const filteredMeals = useMemo(() => {
    if (preferences.selectedRoles.length === 0 && preferences.selectedAims.length === 0) {
      return sampleMeals;
    }

    return sampleMeals.filter(meal => {
      const matchesRole = preferences.selectedRoles.length === 0 || 
        preferences.selectedRoles.some(role => meal.role.includes(role));
      
      const matchesAim = preferences.selectedAims.length === 0 || 
        preferences.selectedAims.some(aim => meal.aim.includes(aim));

      return matchesRole && matchesAim;
    });
  }, [preferences]);

  const handleSwipeLeft = (meal: Meal) => {
    // Dislike - could implement a "disliked meals" list here
    console.log('Disliked:', meal.name);
  };

  const handleSwipeRight = async (meal: Meal) => {
    // Like - add to favorites and navigate to recipe
    const updatedFavorites = [...favoriteMeals];
    if (!updatedFavorites.includes(meal.id)) {
      updatedFavorites.push(meal.id);
      await setFavoriteMeals(updatedFavorites);
    }
    
    router.push(`/recipe/${meal.id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-orange-50 to-green-50">
      <View className="flex-1">
        <View className="px-6 pt-4 pb-2">
          <Text className="text-3xl font-bold text-gray-900">
            Meal Ideas
          </Text>
          <Text className="text-gray-600 text-lg mt-1">
            Swipe right to cook, left to skip
          </Text>
        </View>

          {filteredMeals.length > 0 ? (
            <SwipeableCards
              meals={filteredMeals}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          ) : (
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                No meals found
              </Text>
              <Text className="text-gray-600 text-center">
                Try adjusting your preferences in settings
              </Text>
            </View>
          )}
        </View>

        {/* <View className="px-6 pb-2">
          <Text className="text-center text-sm text-gray-500">
            {filteredMeals.length} meals available with your preferences
          </Text>
        </View> */}
    </SafeAreaView>
  );
}