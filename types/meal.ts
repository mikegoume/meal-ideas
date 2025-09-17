export interface Meal {
  id: string;
  name: string;
  description: string;
  image: string;
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: number;
  calories: number;
  role: MealRole[];
  aim: MealAim[];
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
}

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export type MealRole = 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
export type MealAim = 'normal' | 'diet' | 'bulk' | 'keto' | 'vegan' | 'vegetarian';

export interface UserPreferences {
  selectedRoles: MealRole[];
  selectedAims: MealAim[];
}