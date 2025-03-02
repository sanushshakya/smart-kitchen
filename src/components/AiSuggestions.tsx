import React, { useState, useEffect } from 'react';
import { GroceryItem, UserPreference, FoodItem } from '../types';
import { getAiSuggestedItems } from '../services/aiService';
import { Sparkles, Plus, RefreshCw } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface AiSuggestionsProps {
  userPreferences: UserPreference;
  onAddItem: (item: GroceryItem) => void;
}

const AiSuggestions: React.FC<AiSuggestionsProps> = ({ userPreferences, onAddItem }) => {
  const [suggestedItems, setSuggestedItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const items = await getAiSuggestedItems(userPreferences);
      setSuggestedItems(items);
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, [userPreferences]);

  const handleAddItem = (item: FoodItem) => {
    const groceryItem: GroceryItem = {
      id: uuidv4(),
      name: item.name,
      category: item.category,
      purchased: false,
      price: item.price,
      store: item.store
    };
    
    onAddItem(groceryItem);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Sparkles className="mr-2" size={20} />
          AI Suggestions
        </h2>
        <button 
          onClick={loadSuggestions}
          disabled={loading}
          className="p-2 text-teal-600 hover:text-teal-800 transition-colors"
          title="Refresh suggestions"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      
      <p className="text-gray-600 mb-4">
        Based on your dietary preferences, allergies, and fitness goals, we recommend:
      </p>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : suggestedItems.length === 0 ? (
        <p className="text-center text-gray-500 py-4">
          Add some dietary preferences to get personalized suggestions.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestedItems.map((item, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                  <div className="mt-1 text-xs text-gray-600">
                    <span className="font-medium">{item.nutritionPer100g.calories}</span> cal | 
                    <span className="ml-1">P: {item.nutritionPer100g.protein}g</span> | 
                    <span className="ml-1">C: {item.nutritionPer100g.carbs}g</span> | 
                    <span className="ml-1">F: {item.nutritionPer100g.fat}g</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-sm font-medium text-gray-600">${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</span>
                  <button
                    onClick={() => handleAddItem(item)}
                    className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                    title="Add to list"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiSuggestions;