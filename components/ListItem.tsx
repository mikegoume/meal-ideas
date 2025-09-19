import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { Meal } from '@/types/meal';
import { router } from 'expo-router';
import { Clock, Flame, Users } from 'lucide-react-native';

type ListItemProps = {
  item: Meal;
  index: number;
  scrollY: SharedValue<number>;
};

const ListItem: React.FC<ListItemProps> = ({ item, index, scrollY }) => {
  const animatedListItemStyle = useAnimatedStyle(() => {
    const opacityInputRange = [-1, 0, 176 * index, 176 * (index + 1)];
    const scaleInputRange = [-1, 0, 176 * index, 176 * (index + 2)];
    return {
      opacity: interpolate(scrollY.value, opacityInputRange, [1, 1, 1, -1]),
      transform: [
        {
          scale: interpolate(scrollY.value, scaleInputRange, [1, 1, 1, -0.5]),
        },
      ],
    };
  });

  return (
    <Animated.View style={animatedListItemStyle}>
      <TouchableOpacity
        key={item.id}
        onPress={() => router.push(`/recipe/${item.id}`)}
        className="bg-white rounded-2xl shadow-md overflow-hidden h-28 mb-4">
        <View className="flex-row">
          <Image source={{ uri: item.image }} className="h-28 w-24" />
          <View className="flex-1 px-4 py-2 flex-col justify-between">
            <View>
              <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                {item.name}
              </Text>
              <Text className="text-gray-600 text-sm" numberOfLines={2}>
                {item.description}
              </Text>
            </View>

            <View className="flex-row items-center gap-4">
              <View className="flex-row items-center">
                <Clock size={14} color="#6b7280" />
                <Text className="text-gray-500 ml-1 text-xs">{item.cookingTime}min</Text>
              </View>

              <View className="flex-row items-center">
                <Users size={14} color="#6b7280" />
                <Text className="text-gray-500 ml-1 text-xs">{item.servings}</Text>
              </View>

              <View className="flex-row items-center">
                <Flame size={14} color="#6b7280" />
                <Text className="text-gray-500 ml-1 text-xs">{item.calories}cal</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ListItem;
