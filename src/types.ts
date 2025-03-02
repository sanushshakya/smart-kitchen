export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  expirationDate?: Date | null;
  purchased: boolean;
  price?: number | null;
  store?: string | null;
  user_id?: string;
}

export interface UserPreference {
  id?: string;
  user_id?: string;
  dietaryPreferences: string[];
  allergies: string[];
  fitnessGoals: string[];
  budget: number;
}

export interface Store {
  id: string;
  name: string;
  location: string | null;
}

export interface User {
  id: string;
  email: string | null;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface FoodItem {
  name: string;
  category: string;
  nutritionPer100g: NutritionInfo;
  price?: number;
  store?: string;
}

export interface PriceComparison {
  store: string;
  price: number;
}