// Core data types for the NutriLens app

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  position?: {
    x: number;
    y: number;
  };
}

export interface NutritionData {
  calories: number;
  carbohydrates: number;
  protein: number;
  fats: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface AnalyzedMeal {
  id: string;
  name: string;
  imageUri: string;
  foodItems: FoodItem[];
  nutrition: NutritionData;
  healthScore: number;
  category: MealCategory;
  quantity: number;
  timestamp: Date;
}

export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface FoodRecognitionResult {
  foodItems: FoodItem[];
  imageUri: string;
  confidence: number;
}

export interface NutritionResponse {
  name: string;
  nutrition: NutritionData;
  suggestedCategory: MealCategory;
}

// Navigation types
export type RootStackParamList = {
  Camera: undefined;
  Results: {
    imageUri: string;
    analysisData?: AnalyzedMeal;
  };
  History: undefined;
};
