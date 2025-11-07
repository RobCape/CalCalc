import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnalyzedMeal } from '../types';

interface AppContextType {
  meals: AnalyzedMeal[];
  addMeal: (meal: AnalyzedMeal) => void;
  updateMeal: (id: string, meal: Partial<AnalyzedMeal>) => void;
  deleteMeal: (id: string) => void;
  getMealById: (id: string) => AnalyzedMeal | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [meals, setMeals] = useState<AnalyzedMeal[]>([]);

  const addMeal = (meal: AnalyzedMeal) => {
    setMeals(prevMeals => [meal, ...prevMeals]);
  };

  const updateMeal = (id: string, updatedData: Partial<AnalyzedMeal>) => {
    setMeals(prevMeals =>
      prevMeals.map(meal =>
        meal.id === id ? { ...meal, ...updatedData } : meal
      )
    );
  };

  const deleteMeal = (id: string) => {
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== id));
  };

  const getMealById = (id: string) => {
    return meals.find(meal => meal.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        meals,
        addMeal,
        updateMeal,
        deleteMeal,
        getMealById,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
