import { GroceryItem, Store, UserPreference } from '../types';
import { addDays } from 'date-fns';

// Mock user preferences
export const mockUserPreference: UserPreference = {
  dietaryPreferences: ['vegetarian', 'low-carb'],
  allergies: ['peanuts', 'shellfish'],
  fitnessGoals: ['weight loss', 'muscle gain'],
  budget: 100,
};

// Mock stores
export const mockStores: Store[] = [
  { id: '1', name: 'Whole Foods', location: '123 Main St' },
  { id: '2', name: 'Trader Joe\'s', location: '456 Oak Ave' },
  { id: '3', name: 'Safeway', location: '789 Pine Blvd' },
];

// Mock grocery items with different prices at different stores
export const mockGroceryItems: GroceryItem[] = [
  {
    id: '1',
    name: 'Organic Spinach',
    category: 'Vegetables',
    expirationDate: addDays(new Date(), 5),
    purchased: true,
    price: 3.99,
    store: 'Whole Foods',
  },
  {
    id: '2',
    name: 'Greek Yogurt',
    category: 'Dairy',
    expirationDate: addDays(new Date(), 10),
    purchased: true,
    price: 4.99,
    store: 'Trader Joe\'s',
  },
  {
    id: '3',
    name: 'Chicken Breast',
    category: 'Meat',
    expirationDate: addDays(new Date(), 3),
    purchased: true,
    price: 8.99,
    store: 'Safeway',
  },
  {
    id: '4',
    name: 'Quinoa',
    category: 'Grains',
    purchased: false,
    price: 5.99,
    store: 'Whole Foods',
  },
  {
    id: '5',
    name: 'Almond Milk',
    category: 'Dairy',
    purchased: false,
    price: 3.49,
    store: 'Trader Joe\'s',
  },
];

// AI-suggested items based on user preferences
export const getAiSuggestedItems = (preferences: UserPreference): GroceryItem[] => {
  // In a real app, this would call an AI service
  // For now, we'll return mock data based on preferences
  const suggestedItems: GroceryItem[] = [
    {
      id: '6',
      name: 'Tofu',
      category: 'Protein',
      purchased: false,
      price: 2.99,
      store: 'Trader Joe\'s',
    },
    {
      id: '7',
      name: 'Avocado',
      category: 'Vegetables',
      purchased: false,
      price: 1.99,
      store: 'Whole Foods',
    },
    {
      id: '8',
      name: 'Protein Powder',
      category: 'Supplements',
      purchased: false,
      price: 19.99,
      store: 'Whole Foods',
    },
    {
      id: '9',
      name: 'Cauliflower Rice',
      category: 'Vegetables',
      purchased: false,
      price: 3.49,
      store: 'Trader Joe\'s',
    },
    {
      id: '10',
      name: 'Salmon',
      category: 'Seafood',
      purchased: false,
      price: 12.99,
      store: 'Safeway',
    },
  ];

  // Filter out items that contain allergens
  return suggestedItems.filter(
    (item) => !preferences.allergies.some(
      (allergen) => item.name.toLowerCase().includes(allergen.toLowerCase())
    )
  );
};

// Get price comparison for an item across different stores
export const getPriceComparison = (itemName: string): { store: string; price: number }[] => {
  // In a real app, this would fetch real data
  // For now, we'll return mock data
  const mockPrices = {
    'Organic Spinach': [
      { store: 'Whole Foods', price: 3.99 },
      { store: 'Trader Joe\'s', price: 3.49 },
      { store: 'Safeway', price: 4.29 },
    ],
    'Greek Yogurt': [
      { store: 'Whole Foods', price: 5.49 },
      { store: 'Trader Joe\'s', price: 4.99 },
      { store: 'Safeway', price: 5.29 },
    ],
    'Chicken Breast': [
      { store: 'Whole Foods', price: 9.99 },
      { store: 'Trader Joe\'s', price: 9.49 },
      { store: 'Safeway', price: 8.99 },
    ],
    'Quinoa': [
      { store: 'Whole Foods', price: 5.99 },
      { store: 'Trader Joe\'s', price: 4.99 },
      { store: 'Safeway', price: 6.49 },
    ],
    'Almond Milk': [
      { store: 'Whole Foods', price: 3.99 },
      { store: 'Trader Joe\'s', price: 3.49 },
      { store: 'Safeway', price: 3.79 },
    ],
    'Tofu': [
      { store: 'Whole Foods', price: 3.49 },
      { store: 'Trader Joe\'s', price: 2.99 },
      { store: 'Safeway', price: 3.29 },
    ],
    'Avocado': [
      { store: 'Whole Foods', price: 1.99 },
      { store: 'Trader Joe\'s', price: 1.79 },
      { store: 'Safeway', price: 2.29 },
    ],
    'Protein Powder': [
      { store: 'Whole Foods', price: 19.99 },
      { store: 'Trader Joe\'s', price: 17.99 },
      { store: 'Safeway', price: 21.99 },
    ],
    'Cauliflower Rice': [
      { store: 'Whole Foods', price: 3.99 },
      { store: 'Trader Joe\'s', price: 3.49 },
      { store: 'Safeway', price: 4.29 },
    ],
    'Salmon': [
      { store: 'Whole Foods', price: 13.99 },
      { store: 'Trader Joe\'s', price: 13.49 },
      { store: 'Safeway', price: 12.99 },
    ],
  };

  return mockPrices[itemName as keyof typeof mockPrices] || [];
};

// Get optimized shopping plan
export const getOptimizedShoppingPlan = (items: GroceryItem[]): { store: string; items: GroceryItem[]; totalCost: number }[] => {
  // In a real app, this would use an algorithm to optimize shopping
  // For now, we'll group items by store
  const storeMap = new Map<string, GroceryItem[]>();
  
  items.forEach(item => {
    if (item.store && !item.purchased) {
      if (!storeMap.has(item.store)) {
        storeMap.set(item.store, []);
      }
      storeMap.get(item.store)?.push(item);
    }
  });
  
  const shoppingPlan = Array.from(storeMap.entries()).map(([store, storeItems]) => {
    const totalCost = storeItems.reduce((sum, item) => sum + (item.price || 0), 0);
    return { store, items: storeItems, totalCost };
  });
  
  return shoppingPlan.sort((a, b) => a.totalCost - b.totalCost);
};