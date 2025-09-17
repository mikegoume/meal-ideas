import { Meal } from '@/types/meal';
import { Clock, Flame, Users } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;
const CARD_HEIGHT = CARD_WIDTH * 1.4;

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const difficultyColor = {
    Easy: '#22c55e',
    Medium: '#f97316',
    Hard: '#ef4444',
  };

  return (
    <View style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]} className="bg-white rounded-3xl shadow-lg overflow-hidden">
      <View className="flex-1">
        <Image source={{ uri: meal.image }} style={styles.image} className="w-full h-64 object-cover" />
        
        <View className="absolute top-4 right-4">
          <View className="bg-black/20 px-3 py-1 rounded-full">
            <Text className="text-white text-sm font-semibold capitalize">
              {meal.difficulty}
            </Text>
          </View>
        </View>

        <View className="p-6 flex-1">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {meal.name}
          </Text>
          
          <Text className="text-gray-600 text-base mb-4 leading-6">
            {meal.description}
          </Text>

          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center">
              <Clock size={16} color="#6b7280" />
              <Text className="text-gray-500 ml-2 text-sm">
                {meal.cookingTime} min
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Users size={16} color="#6b7280" />
              <Text className="text-gray-500 ml-2 text-sm">
                {meal.servings} serving{meal.servings > 1 ? 's' : ''}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Flame size={16} color="#6b7280" />
              <Text className="text-gray-500 ml-2 text-sm">
                {meal.calories} cal
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {meal.tags.slice(0, 3).map((tag) => (
              <View key={tag} className="bg-orange-100 px-3 py-1 rounded-full">
                <Text className="text-orange-600 text-xs font-medium">
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
  },
  image: {
    width: '100%',
    height: 250,
  },
});