import { NutritionData, NutritionResponse, FoodItem, MealCategory } from '../types';

/**
 * Nutrition Service
 *
 * Provides nutritional information for food items.
 * Currently uses mock data for development.
 *
 * To integrate with real nutrition API (e.g., Edamam, USDA FoodData Central):
 * 1. Sign up for API key at https://www.edamam.com/ or https://fdc.nal.usda.gov/
 * 2. Install axios: npm install axios
 * 3. Replace mock implementation with actual API calls
 */

// Mock nutrition database
const NUTRITION_DATABASE: { [key: string]: NutritionData } = {
  'Pancakes': {
    calories: 595,
    carbohydrates: 89,
    protein: 10,
    fats: 20,
    fiber: 3,
    sugar: 15,
    sodium: 890,
  },
  'Blueberries': {
    calories: 8,
    carbohydrates: 2,
    protein: 0.1,
    fats: 0.05,
    fiber: 0.3,
    sugar: 1.5,
    sodium: 0.1,
  },
  'Syrup': {
    calories: 12,
    carbohydrates: 3,
    protein: 0,
    fats: 0,
    fiber: 0,
    sugar: 3,
    sodium: 2,
  },
  'Eggs': {
    calories: 155,
    carbohydrates: 1.1,
    protein: 13,
    fats: 11,
    fiber: 0,
    sugar: 0.5,
    sodium: 124,
  },
  'Toast': {
    calories: 79,
    carbohydrates: 15,
    protein: 2.6,
    fats: 1,
    fiber: 0.8,
    sugar: 1.5,
    sodium: 147,
  },
  'Bacon': {
    calories: 43,
    carbohydrates: 0.1,
    protein: 3,
    fats: 3.3,
    fiber: 0,
    sugar: 0,
    sodium: 137,
  },
  'Salad': {
    calories: 150,
    carbohydrates: 12,
    protein: 5,
    fats: 9,
    fiber: 4,
    sugar: 5,
    sodium: 250,
  },
  'Chicken Breast': {
    calories: 165,
    carbohydrates: 0,
    protein: 31,
    fats: 3.6,
    fiber: 0,
    sugar: 0,
    sodium: 74,
  },
};

/**
 * Gets nutrition data for a specific food item
 */
export const getNutritionData = async (
  foodName: string
): Promise<NutritionData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return nutrition data or defaults if not found
  return (
    NUTRITION_DATABASE[foodName] || {
      calories: 100,
      carbohydrates: 15,
      protein: 5,
      fats: 3,
      fiber: 2,
      sugar: 3,
      sodium: 100,
    }
  );
};

/**
 * Combines nutrition data from multiple food items
 */
export const getCombinedNutrition = async (
  foodItems: FoodItem[]
): Promise<NutritionResponse> => {
  const nutritionPromises = foodItems.map(item => getNutritionData(item.name));
  const nutritionDataArray = await Promise.all(nutritionPromises);

  // Combine all nutrition data
  const combined = nutritionDataArray.reduce(
    (acc, nutrition) => ({
      calories: acc.calories + nutrition.calories,
      carbohydrates: acc.carbohydrates + nutrition.carbohydrates,
      protein: acc.protein + nutrition.protein,
      fats: acc.fats + nutrition.fats,
      fiber: (acc.fiber || 0) + (nutrition.fiber || 0),
      sugar: (acc.sugar || 0) + (nutrition.sugar || 0),
      sodium: (acc.sodium || 0) + (nutrition.sodium || 0),
    }),
    {
      calories: 0,
      carbohydrates: 0,
      protein: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
    }
  );

  // Generate meal name from food items
  const mealName = foodItems.length === 1
    ? foodItems[0].name
    : `${foodItems[0].name} with ${foodItems
        .slice(1)
        .map(item => item.name.toLowerCase())
        .join(' & ')}`;

  // Suggest meal category based on time of day
  const suggestedCategory = suggestMealCategory();

  return {
    name: mealName,
    nutrition: combined,
    suggestedCategory,
  };
};

/**
 * Suggests meal category based on current time
 */
const suggestMealCategory = (): MealCategory => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 11) return 'Breakfast';
  if (hour >= 11 && hour < 15) return 'Lunch';
  if (hour >= 15 && hour < 18) return 'Snack';
  return 'Dinner';
};

/**
 * Calculates health score based on nutrition data (0-10)
 * Higher scores indicate healthier meals
 */
export const calculateHealthScore = (nutrition: NutritionData): number => {
  let score = 10;

  // Penalize high calories (over 600)
  if (nutrition.calories > 600) {
    score -= Math.min(2, (nutrition.calories - 600) / 200);
  }

  // Penalize high fats (over 20g)
  if (nutrition.fats > 20) {
    score -= Math.min(2, (nutrition.fats - 20) / 10);
  }

  // Penalize high sugar (over 15g)
  if (nutrition.sugar && nutrition.sugar > 15) {
    score -= Math.min(2, (nutrition.sugar - 15) / 10);
  }

  // Penalize high sodium (over 1000mg)
  if (nutrition.sodium && nutrition.sodium > 1000) {
    score -= Math.min(1, (nutrition.sodium - 1000) / 500);
  }

  // Reward high protein (over 15g)
  if (nutrition.protein > 15) {
    score += Math.min(1, (nutrition.protein - 15) / 10);
  }

  // Reward high fiber (over 5g)
  if (nutrition.fiber && nutrition.fiber > 5) {
    score += Math.min(1, (nutrition.fiber - 5) / 5);
  }

  // Ensure score is between 0 and 10
  return Math.max(0, Math.min(10, Math.round(score * 10) / 10));
};

/**
 * Scales nutrition data based on quantity multiplier
 */
export const scaleNutrition = (
  nutrition: NutritionData,
  multiplier: number
): NutritionData => {
  return {
    calories: Math.round(nutrition.calories * multiplier),
    carbohydrates: Math.round(nutrition.carbohydrates * multiplier * 10) / 10,
    protein: Math.round(nutrition.protein * multiplier * 10) / 10,
    fats: Math.round(nutrition.fats * multiplier * 10) / 10,
    fiber: nutrition.fiber ? Math.round(nutrition.fiber * multiplier * 10) / 10 : undefined,
    sugar: nutrition.sugar ? Math.round(nutrition.sugar * multiplier * 10) / 10 : undefined,
    sodium: nutrition.sodium ? Math.round(nutrition.sodium * multiplier * 10) / 10 : undefined,
  };
};

/**
 * Integration example for Edamam Nutrition API:
 *
 * import axios from 'axios';
 *
 * const EDAMAM_APP_ID = 'your_app_id';
 * const EDAMAM_APP_KEY = 'your_app_key';
 * const EDAMAM_API_URL = 'https://api.edamam.com/api/nutrition-data';
 *
 * export const getNutritionData = async (foodName: string) => {
 *   const response = await axios.get(EDAMAM_API_URL, {
 *     params: {
 *       app_id: EDAMAM_APP_ID,
 *       app_key: EDAMAM_APP_KEY,
 *       ingr: foodName,
 *     },
 *   });
 *
 *   return {
 *     calories: response.data.calories,
 *     carbohydrates: response.data.totalNutrients.CHOCDF.quantity,
 *     protein: response.data.totalNutrients.PROCNT.quantity,
 *     fats: response.data.totalNutrients.FAT.quantity,
 *     // ... map other nutrients
 *   };
 * };
 */
