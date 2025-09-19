import AnimatedFlatList from '@/components/AnimatedFlatList';
import { sampleMeals } from '@/data/meals';
import { useAsyncStorage } from '@/hooks/useAsyncStorage';
import React from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const { storedValue: favoriteMealIds } = useAsyncStorage<string[]>('favoriteMeals', []);

  const favoriteMeals = sampleMeals.filter((meal) => favoriteMealIds.includes(meal.id));

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

  return <AnimatedFlatList style={styles.flatListStyle} data={favoriteMeals} />;
}

const styles = StyleSheet.create({
  flatListStyle: {
    marginTop: (StatusBar?.currentHeight || 42) + 20 * 2 + 80,
    paddingHorizontal: 15,
  },
});
