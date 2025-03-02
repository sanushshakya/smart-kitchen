import { FoodItem, UserPreference, PriceComparison } from '../types';

// OpenAI API endpoint
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

// Cache key for AI suggested items
const CACHE_KEY_FOOD_ITEMS = 'food_items_cache';
const CACHE_EXPIRATION_TIME = 3600 * 1000; // 1 hour

const fetchAiSuggestedItemsFromApi = async (preferences: UserPreference): Promise<FoodItem[]> => {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not found, using mock data');
    return [];
  }

  if (!preferences.dietaryPreferences || Object.keys(preferences.dietaryPreferences).length === 0) {
    console.log('No dietary preferences provided. Please add preferences.');
    return [];
  }

  try {
    const messages = [
      { 
        role: 'system', 
        content: 'You are a nutritionist helpful assistant for diet planning.' 
      },
      { 
        role: 'user', 
        content: `I am creating a grocery shopping list based on dietary preferences and allergies. 
        User's preferences: ${JSON.stringify(preferences.dietaryPreferences)}. 
        User's allergies: ${JSON.stringify(preferences.allergies)}. 
        Suggest 6 food items that meet these criteria with basic nutrition information (per 100g), 
        and categorize the items (e.g., Protein, Grains, etc.).`
      }
    ];

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch nutrition data');
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return [];
    }

    const responseMessage = data.choices[0].message.content;
    const foodData = responseMessage.split('\n\n');

    const parts = foodData.slice(1, -1).map((item: any) => {
      const part = item.split('\n').map((line: string) => line.trim());

      return {
        name: part[0]?.replace(/^\d+\.\s?\*\*(.*?)\*\*$/, '$1').replace(/^-?\s*Food Item:\s*/, '').replace(/^-?\s*Category:\s*/, '').trim() || "Beans", 
        category: part[1]?.replace(/^-?\s*Food Item:\s*/, '').replace(/^-?\s*Category:\s*/, '').trim() || "Vegetables",
        nutritionPer100g: {
          calories: part[3]?.replace(/\s?cal\s?/g, '').replace(/^-?\s*Calories:\s*/, '').replace(/^\-\s?(\d+)\s?kcal$/, '$1').trim() || "0", 
          protein: part[4]?.replace(/\s?g\s?/g, '').replace(/^-?\s*Protein:\s*/, '').replace(/^\-\s?(\d+(\.\d+)?)\s?g$/, '$1').trim() || "0", 
          carbs: part[5]?.replace(/\s?g\s?/g, '').replace(/^-?\s*Carbohydrates:\s*/, '').replace(/^\-\s?(\d+)\s?g$/, '$1').trim() || "0", 
          fat: part[6]?.replace(/\s?g\s?/g, '').replace(/^-?\s*Fat:\s*/, '').replace(/^\-\s?(\d+(\.\d+)?)\s?g$/, '$1').trim() || "0", 
        },
        price: (Math.random() * 10 + 1).toFixed(2),
        store: ['Whole Foods', 'Trader Joe\'s', 'Safeway'][Math.floor(Math.random() * 3)],
      };
    });

    // Cache the response
    localStorage.setItem(CACHE_KEY_FOOD_ITEMS, JSON.stringify({
      timestamp: Date.now(),
      data: parts
    }));

    return parts.filter((item: { name: string; }) => 
      !preferences.allergies.some(allergen => 
        item.name.toLowerCase().includes(allergen.toLowerCase())
      )
    );

  } catch (error) {
    console.error('Error fetching AI suggested items:', error);
    return []; 
  }
};

export const getAiSuggestedItems = async (preferences: UserPreference): Promise<FoodItem[]> => {
  const cachedData = localStorage.getItem(CACHE_KEY_FOOD_ITEMS);
  const cached = cachedData ? JSON.parse(cachedData) : null;

  if (cached && Date.now() - cached.timestamp < CACHE_EXPIRATION_TIME) {
    console.log('Using cached data');
    return cached.data;
  } else {
    console.log('Fetching new data from API');
    return await fetchAiSuggestedItemsFromApi(preferences);
  }
};

export const getPriceComparison = async (): Promise<PriceComparison[]> => {
  const basePrice = Math.random() * 5 + 1; // Random base price between 1 and 6
  
  const mockPrices: PriceComparison[] = [
    { 
      store: 'Whole Foods', 
      price: parseFloat((basePrice * (1 + Math.random() * 0.3)).toFixed(2)) 
    },
    { 
      store: 'Trader Joe\'s', 
      price: parseFloat((basePrice * (1 - Math.random() * 0.2)).toFixed(2)) 
    },
    { 
      store: 'Safeway', 
      price: parseFloat((basePrice * (1 + Math.random() * 0.1 - 0.05)).toFixed(2)) 
    },
  ];
  
  return mockPrices.sort((a, b) => a.price - b.price);
};

export const getOptimizedShoppingPlan = async (
  items: { name: string; price?: number | null; store?: string | null; purchased: boolean }[]
): Promise<{ store: string; items: any[]; totalCost: number }[]> => {
  // Group unpurchased items by store
  const storeMap = new Map<string, any[]>();
  
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
