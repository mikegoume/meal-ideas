// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from '@instantdb/react-native';

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    meals: i.entity({
      name: i.string(),
      description: i.string(),
      image: i.string(),
      cookingTime: i.number(),
      difficulty: i.string(), // 'Easy' | 'Medium' | 'Hard'
      servings: i.number(),
      calories: i.number(),
      instructions: i.json(), // Array of strings
      tags: i.json(), // Array of strings
    }),

    ingredients: i.entity({
      name: i.string(),
      amount: i.string(),
      unit: i.string(),
    }),

    mealRoles: i.entity({
      role: i.string(), // 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert'
    }),

    mealAims: i.entity({
      aim: i.string(), // 'normal' | 'diet' | 'bulk' | 'keto' | 'vegan' | 'vegetarian'
    }),

    userPreferences: i.entity({
      userId: i.string(),
    }),

    userRoles: i.entity({
      role: i.string(),
    }),

    userAims: i.entity({
      aim: i.string(),
    }),
  },
  links: {
    mealIngredients: {
      forward: {
        on: 'meals',
        has: 'many',
        label: 'ingredients',
      },
      reverse: {
        on: 'ingredients',
        has: 'one',
        label: 'meal',
      },
    },

    // Meal -> MealRoles (many-to-many)
    mealToRoles: {
      forward: {
        on: 'meals',
        has: 'many',
        label: 'roles',
      },
      reverse: {
        on: 'mealRoles',
        has: 'many',
        label: 'meals',
      },
    },

    // Meal -> MealAims (many-to-many)
    mealToAims: {
      forward: {
        on: 'meals',
        has: 'many',
        label: 'aims',
      },
      reverse: {
        on: 'mealAims',
        has: 'many',
        label: 'meals',
      },
    },

    // UserPreferences -> UserRoles (one-to-many)
    userPreferenceRoles: {
      forward: {
        on: 'userPreferences',
        has: 'many',
        label: 'selectedRoles',
      },
      reverse: {
        on: 'userRoles',
        has: 'one',
        label: 'userPreference',
      },
    },

    // UserPreferences -> UserAims (one-to-many)
    userPreferenceAims: {
      forward: {
        on: 'userPreferences',
        has: 'many',
        label: 'selectedAims',
      },
      reverse: {
        on: 'userAims',
        has: 'one',
        label: 'userPreference',
      },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
