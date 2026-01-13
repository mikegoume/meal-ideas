import { getFavorites } from '@/api/favorites';
import recipes from '@/assets/mock/recipes.json';
import ListItem from '@/components/ListItem';
import { useAuthContext } from '@/hooks/useAuth';
import { IRecipe } from '@/types/recipe';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FavoritesScreen() {
  const { top } = useSafeAreaInsets();
  const { session } = useAuthContext();

  const { data } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => getFavorites(session?.user.id!),
  });

  const likedRecipeIds = data?.map((recipe) => recipe.recipe_id) || [];
  const likedRecipes = recipes.results.filter((recipe: IRecipe) =>
    likedRecipeIds.includes(recipe.id),
  );

  return (
    <View className="flex-1 bg-neutral-50" style={{ paddingTop: top }}>
      <FlashList
        contentContainerClassName={`mx-6`}
        ListHeaderComponent={() => (
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900">Favorites</Text>
            <Text className="text-gray-600 text-lg">Access your favorite recipes</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center">
            <Text className="text-6xl mb-4">❤️</Text>
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              No favorites yet
            </Text>
            <Text className="text-gray-600 text-center">
              Start swiping on meals to add them to your favorites!
            </Text>
          </View>
        )}
        data={likedRecipes}
        renderItem={({ item }) => <ListItem item={item} />}
      />
    </View>
  );
}
