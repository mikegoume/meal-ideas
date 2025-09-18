import { sampleMeals } from '@/data/meals';
import { useAsyncStorage } from '@/hooks/useAsyncStorage';
import { router } from 'expo-router';
import { Clock, Flame, Users } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const { storedValue: favoriteMealIds } = useAsyncStorage<string[]>('favoriteMeals', []);

  const favoriteMeals = sampleMeals.filter(meal => favoriteMealIds.includes(meal.id));

  if (favoriteMeals.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-6xl mb-4">❤️</Text>
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            No favorites yet
          </Text>
          <Text className="text-gray-600 text-center">
            Start swiping on meals to add them to your favorites!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-4 pb-2">
        <Text className="text-3xl font-bold text-gray-900">
          Your Favorites
        </Text>
        <Text className="text-gray-600 text-lg mt-1">
          {favoriteMeals.length} saved meal{favoriteMeals.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView className="flex-1 px-6">
        {favoriteMeals.map((meal) => (
          <TouchableOpacity
            key={meal.id}
            onPress={() => router.push(`/recipe/${meal.id}`)}
            className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden"
          >
            <View className="flex-row">
              <Image
                source={{ uri: meal.image }}
                className="w-24 h-24"
              />
              <View className="flex-1 p-4">
                <Text className="text-lg font-bold text-gray-900 mb-1">
                  {meal.name}
                </Text>
                <Text className="text-gray-600 text-sm mb-2" numberOfLines={2}>
                  {meal.description}
                </Text>
                
                <View className="flex-row items-center space-x-4">
                  <View className="flex-row items-center">
                    <Clock size={14} color="#6b7280" />
                    <Text className="text-gray-500 ml-1 text-xs">
                      {meal.cookingTime}min
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <Users size={14} color="#6b7280" />
                    <Text className="text-gray-500 ml-1 text-xs">
                      {meal.servings}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center">
                    <Flame size={14} color="#6b7280" />
                    <Text className="text-gray-500 ml-1 text-xs">
                      {meal.calories}cal
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}