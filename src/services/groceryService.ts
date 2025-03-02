import { supabase } from '../lib/supabase';
import { GroceryItem, UserPreference, Store } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Grocery Items
export const fetchGroceryItems = async (userId: string): Promise<GroceryItem[]> => {
  const { data, error } = await supabase
    .from('grocery_items')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching grocery items:', error);
    throw error;
  }

  return data.map(item => ({
    id: item.id,
    name: item.name,
    category: item.category,
    expirationDate: item.expiration_date ? new Date(item.expiration_date) : null,
    purchased: item.purchased,
    price: item.price,
    store: item.store,
    user_id: item.user_id
  }));
};

export const addGroceryItem = async (userId: string, item: GroceryItem): Promise<GroceryItem> => {
  const { data, error } = await supabase
    .from('grocery_items')
    .insert([{
      id: item.id || uuidv4(),
      user_id: userId,
      name: item.name,
      category: item.category || 'Other',
      expiration_date: item.expirationDate ? item.expirationDate.toISOString().split('T')[0] : null,
      purchased: item.purchased || false,
      price: item.price || null,
      store: item.store || null
    }])
    .select()
    .single();

  if (error) {
    console.error('Error adding grocery item:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    expirationDate: data.expiration_date ? new Date(data.expiration_date) : null,
    purchased: data.purchased,
    price: data.price,
    store: data.store,
    user_id: data.user_id
  };
};

export const updateGroceryItem = async (item: GroceryItem): Promise<GroceryItem> => {
  const { data, error } = await supabase
    .from('grocery_items')
    .update({
      name: item.name,
      category: item.category,
      expiration_date: item.expirationDate ? item.expirationDate.toISOString().split('T')[0] : null,
      purchased: item.purchased,
      price: item.price,
      store: item.store,
      updated_at: new Date().toISOString()
    })
    .eq('id', item.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating grocery item:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    category: data.category,
    expirationDate: data.expiration_date ? new Date(data.expiration_date) : null,
    purchased: data.purchased,
    price: data.price,
    store: data.store,
    user_id: data.user_id
  };
};

export const deleteGroceryItem = async (itemId: string): Promise<void> => {
  const { error } = await supabase
    .from('grocery_items')
    .delete()
    .eq('id', itemId);

  if (error) {
    console.error('Error deleting grocery item:', error);
    throw error;
  }
};

// User Preferences
export const fetchUserPreferences = async (userId: string): Promise<UserPreference> => {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user preferences:', error);
    throw error;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    dietaryPreferences: data.dietary_preferences || [],
    allergies: data.allergies || [],
    fitnessGoals: data.fitness_goals || [],
    budget: data.budget || 100
  };
};

export const updateUserPreferences = async (userId: string, preferences: UserPreference): Promise<UserPreference> => {
  const { data, error } = await supabase
    .from('user_preferences')
    .update({
      dietary_preferences: preferences.dietaryPreferences,
      allergies: preferences.allergies,
      fitness_goals: preferences.fitnessGoals,
      budget: preferences.budget,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    dietaryPreferences: data.dietary_preferences,
    allergies: data.allergies,
    fitnessGoals: data.fitness_goals,
    budget: data.budget
  };
};

// Stores
export const fetchStores = async (): Promise<Store[]> => {
  const { data, error } = await supabase
    .from('stores')
    .select('*');

  if (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }

  return data.map(store => ({
    id: store.id,
    name: store.name,
    location: store.location
  }));
};