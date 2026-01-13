import recipes from '@/assets/mock/recipes.json';
import { SwipeableCards } from '@/components/SwipeableCards';
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { bottom, top } = useSafeAreaInsets();

  // const { profile } = useAuthContext();

  // if (!profile) return null;

  // const { height, weight, age, sex, activity_level } = profile;

  // const tdee = calculateBMR({ weight, height, age, sex });

  // console.log('tdee: ', tdee);

  // const calories = tdee * activityMultipliers[activity_level];

  // console.log(calories);

  // const params = new URLSearchParams({
  //   apiKey: '5674a4134c804548a59ea66bf326de91',
  //   number: '100',
  //   type: 'main course',
  //   minCalories: `${Math.floor(calories * 0.3 - 100)}`,
  //   maxCalories: `${Math.floor(calories * 0.3 + 200)}`,
  //   addRecipeNutrition: 'true',
  //   addRecipeInstructions: 'true',
  //   instructionsRequired: 'true',
  // });

  // const recipesQuery = useQuery({
  //   queryKey: ['recipes'],
  //   queryFn: () => getRecipesFromSpoonacular(params),
  // });

  // const recipes = recipesQuery.data || [];

  // console.log(recipes);

  return (
    <View className="flex flex-1 bg-neutral-50" style={{ paddingTop: top, paddingBottom: bottom }}>
      <View className="flex-1">
        <View className="px-6">
          <Text className="text-3xl font-bold text-gray-900">Meal Ideas</Text>
          <Text className="text-gray-600 text-lg">Swipe right to cook, left to skip</Text>
        </View>

        <View className="flex-1">
          {recipes.results.length > 0 ? (
            <SwipeableCards />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-xl font-bold text-gray-900 text-center mb-2">
                No meals found
              </Text>
              <Text className="text-gray-600 text-center">
                Try adjusting your preferences in
                <Link href="/settings" className="text-blue-500">
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
