import PlusCardImage from '@/assets/images/homepage/homepage-plus-card.png';
import drinks from '@/assets/mock/drinks.json';
import recipes from '@/assets/mock/recipes.json';
import SettingsProfileInfo from '@/components/molecules/SettingsProfileInfo';
import { FlashList } from '@shopify/flash-list';
import { ArrowRight, Clock, Heart } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const quickActionCards = [
  {
    id: 0,
    title: 'Discover Plus +',
    subtitle: 'Unlock the full Meal Ideas experience!',
    actionButtonText: 'Try for free',
    bgImage: PlusCardImage,
  },
];

const mealCategories = ['For you', 'Breakfast', 'Snack', 'Lunch', 'Dinner', 'Dessert'];

export default function HomeScreen() {
  const { bottom, top } = useSafeAreaInsets();

  const [selectedMealTypeIndex, setSelectedMealTypeIndex] = useState(0);

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

  // const { data } = useQuery({
  //   queryKey: ['recipes'],
  //   queryFn: () => getRecipesFromSpoonacular(params),
  // });

  // console.log(data);

  return (
    <ScrollView className="flex flex-1 bg-white" style={{ paddingTop: top, paddingBottom: bottom }}>
      <View className="flex-1 flex-col gap-6">
        <View className="p-4">
          <SettingsProfileInfo showLogoutButton={false} />
        </View>
        <FlashList
          horizontal={true}
          data={quickActionCards}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => {
            return (
              <View
                className="relative w-[300px] h-48 rounded-3xl bg-orange-300 mr-4 p-4 justify-between"
                style={[index === 0 && { marginLeft: 16 }]}>
                <Text className="text-2xl">{item.title}</Text>
                <View className="w-2/3">
                  <Text>{item.subtitle}</Text>
                </View>
                <Pressable>
                  <View className="bg-gray-50 p-3 rounded-full flex flex-row justify-center items-center gap-2 w-1/2">
                    <Text className="font-semibold">{item.actionButtonText}</Text>
                    <View className="size-8 bg-black items-center justify-center rounded-full">
                      <ArrowRight color={'#fff'} size={18} />
                    </View>
                  </View>
                </Pressable>
                <Image source={item.bgImage} className="size-56 absolute right-4 top-1" />
              </View>
            );
          }}
        />
        <View className="flex flex-col gap-4">
          <View className="px-4">
            <Text className="text-lg font-semibold">What are you looking for?</Text>
          </View>
          <FlashList
            horizontal={true}
            data={mealCategories}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const isSelected = index === selectedMealTypeIndex;

              return (
                <Pressable
                  className="p-2 px-4 rounded-full border-[1px] mr-4 border-gray-500"
                  style={[
                    { marginLeft: index === 0 ? 16 : 0 },
                    isSelected && { backgroundColor: 'black' },
                  ]}>
                  <Text className="text-sm" style={isSelected && { color: 'white' }}>
                    {item}
                  </Text>
                </Pressable>
              );
            }}
          />
          <FlashList
            horizontal={true}
            data={recipes.results.slice(0, 10)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <Pressable>
                  <View
                    className="bg-gray-200"
                    style={[
                      { marginLeft: index === 0 ? 16 : 0 },
                      {
                        width: 160,
                        height: 260,
                        marginRight: 16,
                        borderRadius: 16,
                        overflow: 'hidden',
                      },
                    ]}>
                    <View style={{ width: 160, height: 145, position: 'relative' }}>
                      <Pressable>
                        <View
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: '#c0c0c099',
                            width: 35,
                            height: 35,
                            borderRadius: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Heart size={18} />
                        </View>
                      </Pressable>
                      <Image source={{ uri: item.image }} style={{ flex: 1, zIndex: -1 }} />
                    </View>
                    <View className="flex flex-col flex-1 m-3 gap-1 justify-end">
                      <View className="flex flex-row w-[80px] gap-1 items-center bg-white rounded-full p-1 justify-center">
                        <Clock size={14} />
                        <Text>{item.readyInMinutes} min.</Text>
                      </View>
                      <Text numberOfLines={2} className="font-semibold text-lg">
                        {item.title}
                      </Text>
                      <Text className="">by {item.sourceName}</Text>
                    </View>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
        <View className="flex flex-col gap-4">
          <View className="px-4">
            <Text className="text-lg font-semibold">Maybe Draink?</Text>
          </View>
          <FlashList
            horizontal={true}
            data={drinks.results.slice(0, 10)}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <Pressable>
                  <View
                    className="bg-gray-200"
                    style={[
                      { marginLeft: index === 0 ? 16 : 0 },
                      {
                        width: 160,
                        height: 240,
                        marginRight: 16,
                        borderRadius: 16,
                        overflow: 'hidden',
                      },
                    ]}>
                    <View style={{ width: 160, height: 145, position: 'relative' }}>
                      <Pressable>
                        <View
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: '#c0c0c099',
                            width: 35,
                            height: 35,
                            borderRadius: '100%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Heart size={18} />
                        </View>
                      </Pressable>
                      <Image source={{ uri: item.strDrinkThumb }} style={{ flex: 1, zIndex: -1 }} />
                    </View>
                    <View className="flex flex-col flex-1 m-3 gap-1 justify-start">
                      <View className="flex flex-row w-[80px] gap-1 items-center bg-white rounded-full p-1 justify-center">
                        <Clock size={14} />
                        <Text>15 min.</Text>
                      </View>
                      <Text numberOfLines={2} className="font-semibold text-lg">
                        {item.strDrink}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            }}
          />
        </View>
        {/* <View className="flex-1">
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
        </View> */}
      </View>
    </ScrollView>
  );
}
