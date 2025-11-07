import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, AnalyzedMeal, MealCategory } from '../types';
import { useApp } from '../context/AppContext';
import { recognizeFoodFromImage } from '../services/foodRecognitionService';
import { getCombinedNutrition, calculateHealthScore, scaleNutrition } from '../services/nutritionService';
import Svg, { Path } from 'react-native-svg';

type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Results'>;
type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

const MEAL_CATEGORIES: MealCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const ResultsScreen: React.FC = () => {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const route = useRoute<ResultsScreenRouteProp>();
  const { addMeal } = useApp();

  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [meal, setMeal] = useState<AnalyzedMeal | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>('Breakfast');

  useEffect(() => {
    analyzeMeal();
  }, []);

  const analyzeMeal = async () => {
    try {
      setIsAnalyzing(true);

      // Step 1: Recognize food from image
      const recognitionResult = await recognizeFoodFromImage(route.params.imageUri);

      // Step 2: Get nutrition data
      const nutritionResponse = await getCombinedNutrition(recognitionResult.foodItems);

      // Step 3: Calculate health score
      const healthScore = calculateHealthScore(nutritionResponse.nutrition);

      // Create analyzed meal object
      const analyzedMeal: AnalyzedMeal = {
        id: `meal_${Date.now()}`,
        name: nutritionResponse.name,
        imageUri: route.params.imageUri,
        foodItems: recognitionResult.foodItems,
        nutrition: nutritionResponse.nutrition,
        healthScore,
        category: nutritionResponse.suggestedCategory,
        quantity: 1,
        timestamp: new Date(),
      };

      setMeal(analyzedMeal);
      setSelectedCategory(nutritionResponse.suggestedCategory);
    } catch (error) {
      console.error('Error analyzing meal:', error);
      Alert.alert('Error', 'Failed to analyze meal. Please try again.');
      navigation.goBack();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleSave = () => {
    if (!meal) return;

    const finalMeal: AnalyzedMeal = {
      ...meal,
      quantity,
      category: selectedCategory,
      nutrition: scaleNutrition(meal.nutrition, quantity),
    };

    addMeal(finalMeal);
    Alert.alert('Success', 'Meal saved to history!', [
      { text: 'OK', onPress: () => navigation.navigate('Camera') },
    ]);
  };

  if (isAnalyzing || !meal) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Analyzing your meal...</Text>
      </View>
    );
  }

  const scaledNutrition = scaleNutrition(meal.nutrition, quantity);
  const scaledHealthScore = calculateHealthScore(scaledNutrition);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </Svg>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nutrition</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2}>
            <Path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Food Image with Labels */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: meal.imageUri }} style={styles.foodImage} />
          {meal.foodItems.map((item, index) => (
            <View
              key={item.id}
              style={[
                styles.nutritionBubble,
                {
                  top: `${(item.position?.y || 0.1 + index * 0.15) * 100}%`,
                  left: item.position?.x ? `${item.position.x * 100}%` : index % 2 === 0 ? '5%' : '60%',
                },
              ]}>
              <Text style={styles.bubbleText}>{item.name}</Text>
              <Text style={styles.bubbleCalories}>{item.calories}</Text>
            </View>
          ))}
        </View>

        {/* Nutrition Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailsContent}>
            {/* Meal Name and Category */}
            <View style={styles.mealHeader}>
              <Text style={styles.mealName}>{meal.name}</Text>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryText}>{selectedCategory}</Text>
                <View style={styles.quantityControl}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(-1)}>
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(1)}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Nutrition Grid */}
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <View style={styles.nutritionLabel}>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth={2}>
                    <Path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10M9 21h6" />
                  </Svg>
                  <Text style={styles.labelText}>Calories</Text>
                </View>
                <Text style={styles.nutritionValue}>{scaledNutrition.calories}</Text>
              </View>

              <View style={styles.nutritionItem}>
                <View style={styles.nutritionLabel}>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth={2}>
                    <Path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                  </Svg>
                  <Text style={styles.labelText}>Carbs</Text>
                </View>
                <Text style={styles.nutritionValue}>{scaledNutrition.carbohydrates}g</Text>
              </View>

              <View style={styles.nutritionItem}>
                <View style={styles.nutritionLabel}>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2}>
                    <Path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </Svg>
                  <Text style={styles.labelText}>Protein</Text>
                </View>
                <Text style={styles.nutritionValue}>{scaledNutrition.protein}g</Text>
              </View>

              <View style={styles.nutritionItem}>
                <View style={styles.nutritionLabel}>
                  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth={2}>
                    <Path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </Svg>
                  <Text style={styles.labelText}>Fats</Text>
                </View>
                <Text style={styles.nutritionValue}>{scaledNutrition.fats}g</Text>
              </View>
            </View>

            {/* Health Score */}
            <View style={styles.healthScoreContainer}>
              <View style={styles.healthScoreHeader}>
                <Text style={styles.healthScoreLabel}>Health score</Text>
                <Text style={styles.healthScoreValue}>{scaledHealthScore}/10</Text>
              </View>
              <View style={styles.healthScoreBar}>
                <View
                  style={[
                    styles.healthScoreFill,
                    { width: `${(scaledHealthScore / 10) * 100}%` },
                  ]}
                />
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.secondaryButton} onPress={analyzeMeal}>
                <Text style={styles.secondaryButtonText}>Fix Results</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
                <Text style={styles.primaryButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    height: 88,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 44,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  nutritionBubble: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bubbleCalories: {
    fontSize: 14,
    color: '#999',
  },
  detailsContainer: {
    backgroundColor: '#fff',
    marginTop: -12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  detailsContent: {
    padding: 20,
    gap: 20,
  },
  mealHeader: {
    gap: 8,
  },
  mealName: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryText: {
    fontSize: 15,
    color: '#666',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 20,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    color: '#999',
  },
  quantityText: {
    width: 32,
    textAlign: 'center',
    fontSize: 15,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  nutritionItem: {
    width: '47%',
  },
  nutritionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  labelText: {
    fontSize: 15,
    color: '#666',
  },
  nutritionValue: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  healthScoreContainer: {
    gap: 8,
  },
  healthScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthScoreLabel: {
    fontSize: 15,
    color: '#666',
  },
  healthScoreValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  healthScoreBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  healthScoreFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 4,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#000',
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#fff',
  },
});

export default ResultsScreen;
