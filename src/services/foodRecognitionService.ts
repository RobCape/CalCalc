import { FoodRecognitionResult, FoodItem } from '../types';

/**
 * Food Recognition Service
 *
 * This service handles food recognition from images using AI/ML APIs.
 * Currently implemented with mock data for development.
 *
 * To integrate with Google Cloud Vision API:
 * 1. Set up Google Cloud project and enable Vision API
 * 2. Install: npm install @google-cloud/vision
 * 3. Replace mock implementation with actual API calls
 */

// Mock food database for demo purposes
const MOCK_FOODS = [
  { name: 'Pancakes', calories: 595 },
  { name: 'Blueberries', calories: 8 },
  { name: 'Syrup', calories: 12 },
  { name: 'Eggs', calories: 155 },
  { name: 'Toast', calories: 79 },
  { name: 'Bacon', calories: 43 },
  { name: 'Orange Juice', calories: 112 },
  { name: 'Coffee', calories: 2 },
  { name: 'Salad', calories: 150 },
  { name: 'Chicken Breast', calories: 165 },
];

/**
 * Analyzes an image and returns detected food items
 * @param imageUri - URI of the captured image
 * @returns Promise with food recognition results
 */
export const recognizeFoodFromImage = async (
  imageUri: string
): Promise<FoodRecognitionResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock response - randomly select 1-3 food items
  const numItems = Math.floor(Math.random() * 3) + 1;
  const selectedFoods: FoodItem[] = [];

  for (let i = 0; i < numItems; i++) {
    const randomFood = MOCK_FOODS[Math.floor(Math.random() * MOCK_FOODS.length)];
    selectedFoods.push({
      id: `food_${Date.now()}_${i}`,
      name: randomFood.name,
      calories: randomFood.calories,
      position: {
        x: Math.random() * 0.6 + 0.1, // 10-70% from left
        y: Math.random() * 0.6 + 0.1, // 10-70% from top
      },
    });
  }

  return {
    foodItems: selectedFoods,
    imageUri,
    confidence: 0.85 + Math.random() * 0.1, // 85-95% confidence
  };
};

/**
 * Integration guide for Google Cloud Vision API:
 *
 * import vision from '@google-cloud/vision';
 *
 * const client = new vision.ImageAnnotatorClient({
 *   keyFilename: 'path/to/service-account-key.json',
 * });
 *
 * export const recognizeFoodFromImage = async (imageUri: string) => {
 *   const [result] = await client.labelDetection(imageUri);
 *   const labels = result.labelAnnotations;
 *
 *   // Filter for food-related labels
 *   const foodLabels = labels.filter(label =>
 *     isFoodRelated(label.description)
 *   );
 *
 *   return processLabelsToFoodItems(foodLabels, imageUri);
 * };
 */
