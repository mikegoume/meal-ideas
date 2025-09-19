import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';

import { Meal } from '@/types/meal';
import ListItem from './ListItem';

type AnimatedFlatListProps = {
  data: Meal[];
  style: StyleProp<ViewStyle>;
};

const AnimatedFlatList: React.FC<AnimatedFlatListProps> = ({ data, style }) => {
  const scrollY = useSharedValue(0);

  return (
    <Animated.FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={style}
      onScroll={(e) => (scrollY.value = e.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
      renderItem={({ item, index }) => {
        return <ListItem item={item} index={index} scrollY={scrollY} />;
      }}
    />
  );
};

export default AnimatedFlatList;
