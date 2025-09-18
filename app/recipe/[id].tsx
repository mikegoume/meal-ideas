import { sampleMeals } from '@/data/meals';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Clock, Flame, MessageCircle, Users } from 'lucide-react-native';
import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecipeScreen() {
  const { id } = useLocalSearchParams();
  const meal = sampleMeals.find(m => m.id === id);

  if (!meal) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-xl font-bold text-gray-900">Recipe not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-orange-100 text-orange-800',
    Hard: 'bg-red-100 text-red-800',
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push(`/chat/${meal.id}`)}
          className="bg-orange-500 px-4 py-2 rounded-full flex-row items-center"
        >
          <MessageCircle size={18} color="white" />
          <Text className="text-white font-medium ml-2">Ask AI</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        <Image
          source={{ uri: meal.image }}
          className="w-full h-64"
        />

        <View className="p-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            {meal.name}
          </Text>

          <Text className="text-gray-600 text-lg mb-4 leading-6">
            {meal.description}
          </Text>

          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Clock size={20} color="#6b7280" />
              <Text className="text-gray-500 ml-2">
                {meal.cookingTime} minutes
              </Text>
            </View>

            <View className="flex-row items-center">
              <Users size={20} color="#6b7280" />
              <Text className="text-gray-500 ml-2">
                {meal.servings} serving{meal.servings > 1 ? 's' : ''}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Flame size={20} color="#6b7280" />
              <Text className="text-gray-500 ml-2">
                {meal.calories} cal
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-6">
            <View className={`px-3 py-1 rounded-full ${difficultyColors[meal.difficulty]}`}>
              <Text className="font-medium text-sm">
                {meal.difficulty}
              </Text>
            </View>

            <View className="flex-row flex-wrap gap-2 ml-4">
              {meal.tags.map((tag) => (
                <View key={tag} className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-gray-600 text-sm">
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Ingredients
          </Text>

          <View className="space-y-3 mb-8">
            {meal.ingredients.map((ingredient, index) => (
              <View key={index} className="flex-row items-center bg-gray-50 p-3 rounded-lg">
                <View className="w-6 h-6 bg-orange-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white font-bold text-xs">✓</Text>
                </View>
                <Text className="flex-1 text-gray-900">
                  <Text className="font-medium">{ingredient.amount} {ingredient.unit}</Text>
                  {' '}{ingredient.name}
                </Text>
              </View>
            ))}
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-4">
            Instructions
          </Text>

          <View className="space-y-4 mb-8">
            {meal.instructions.map((instruction, index) => (
              <View key={index} className="flex-row">
                <View className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center mr-4 mt-1">
                  <Text className="text-white font-bold text-sm">{index + 1}</Text>
                </View>
                <Text className="flex-1 text-gray-900 text-base leading-6 pt-1">
                  {instruction}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => router.push(`/chat/${meal.id}`)}
            className="bg-orange-500 p-4 rounded-2xl flex-row items-center justify-center mb-6"
          >
            <MessageCircle size={20} color="white" />
            <Text className="text-white font-bold text-lg ml-2">
              Get AI Cooking Help
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}