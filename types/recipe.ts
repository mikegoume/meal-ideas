export interface IRecipe {
  id: number;
  image: string;
  imageType: string;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  cheap: boolean;
  veryPopular: boolean;
  sustainable: boolean;
  lowFodmap: boolean;
  weightWatcherSmartPoints: number;
  gaps: string;
  preparationMinutes: number | null;
  cookingMinutes: number | null;
  aggregateLikes: number;
  healthScore: number;
  creditsText: string;
  license: string | null;
  sourceName: string;
  pricePerServing: number;
  nutrition: INutrition;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  analyzedInstructions: IInstruction[];
  spoonacularScore: number;
  spoonacularSourceUrl: string;
}

export interface INutrition {
  nutrients: INutrient[];
  properties: IPropery[];
  flavonoids: IFlavonoid[];
  ingredients: IIngridient[];
  caloricBreakdown: ICaloricBreakdown;
  weightPerServing: IWeightPerServing;
}

interface INutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

interface IPropery {
  name: string;
  amount: number;
  unit: string;
}

interface IFlavonoid {
  name: string;
  amount: number;
  unit: string;
}

interface IIngridient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  nutrients: INutrient[];
}

interface ICaloricBreakdown {
  percentProtein: number;
  percentFat: number;
  percentCarbs: number;
}

interface IWeightPerServing {
  amount: number;
  unit: string;
}

interface IInstruction {
  name: string;
  steps: IInstructionStep[];
}

interface IInstructionStep {
  number: number;
  step: string;
  ingredients: IIngridient[];
  equipment: IIngridient[];
  length?: {
    number: number;
    unit: string;
  };
}
