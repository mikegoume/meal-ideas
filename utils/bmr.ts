// weight in kg, height in cm
export function calculateBMR({
  weight,
  height,
  age,
  sex,
}: {
  weight: number;
  height: number;
  age: number;
  sex: string;
}) {
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export const MEAL_SPLIT = {
  breakfast: 0.25,
  lunch: 0.3,
  dinner: 0.3,
  snack: 0.15,
};

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
