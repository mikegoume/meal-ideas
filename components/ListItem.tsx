import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { IRecipe } from '@/types/recipe';
import { router } from 'expo-router';
import { Clock, Flame, Users } from 'lucide-react-native';

type ListItemProps = {
  item: IRecipe;
};

const ListItem: React.FC<ListItemProps> = ({ item }) => {
  return (
    <TouchableOpacity
      key={item.id}
      onPress={() => router.push(`/recipe/${item.id}`)}
      className="bg-white rounded-2xl shadow-md overflow-hidden h-28 mb-4">
      <View className="flex-row">
        <Image source={{ uri: item.image }} className="h-28 w-24" />
        <View className="flex-1 px-4 py-2 flex-col justify-between">
          <View>
            <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
              {item.title}
            </Text>
            <Text className="text-gray-600 text-sm" numberOfLines={2}>
              {item.summary}
            </Text>
          </View>

          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-row items-center">
              <Clock size={14} color="#6b7280" />
              <Text className="text-gray-500 ml-1 text-xs">{item.preparationMinutes}min</Text>
            </View>

            <View className="flex-row items-center">
              <Users size={14} color="#6b7280" />
              <Text className="text-gray-500 ml-1 text-xs">{item.servings}</Text>
            </View>

            <View className="flex-row items-center">
              <Flame size={14} color="#6b7280" />
              <Text className="text-gray-500 ml-1 text-xs">
                {item.nutrition.nutrients[0].amount} {item.nutrition.nutrients[0].unit}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ListItem;
