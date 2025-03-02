import React, { useState } from 'react';
import { GroceryItem } from '../types';
import { format } from 'date-fns';
import { ShoppingBag, DollarSign, AlertTriangle, Check, Plus, X, Calendar } from 'lucide-react';
import { getPriceComparison } from '../services/aiService';
import toast from 'react-hot-toast';

interface GroceryListProps {
  items: GroceryItem[];
  onAddItem: (item: GroceryItem) => void;
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
}

const GroceryList: React.FC<GroceryListProps> = ({ 
  items, 
  onAddItem, 
  onToggleItem,
  onRemoveItem
}) => {
  const [newItem, setNewItem] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Other');
  const [newItemPrice, setNewItemPrice] = useState<string>('');
  const [newItemStore, setNewItemStore] = useState<string>('');
  const [newItemExpDate, setNewItemExpDate] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPriceComparison, setShowPriceComparison] = useState<string | null>(null);
  const [priceComparisons, setPriceComparisons] = useState<Record<string, { store: string; price: number }[]>>({});

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      try {
        const item: GroceryItem = {
          id: Date.now().toString(),
          name: newItem,
          category: newItemCategory || 'Other',
          purchased: false,
          price: newItemPrice ? parseFloat(newItemPrice) : undefined,
          store: newItemStore || undefined,
          expirationDate: newItemExpDate ? new Date(newItemExpDate) : undefined
        };
        
        onAddItem(item);
        
        // Reset form
        setNewItem('');
        setNewItemCategory('Other');
        setNewItemPrice('');
        setNewItemStore('');
        setNewItemExpDate('');
        setShowAddForm(false);
        
        toast.success(`Added ${item.name} to your grocery list`);
      } catch (error) {
        toast.error('Failed to add item');
        console.error('Error adding item:', error);
      }
    }
  };

  const togglePriceComparison = async (itemName: string) => {
    if (showPriceComparison === itemName) {
      setShowPriceComparison(null);
    } else {
      setShowPriceComparison(itemName);
      
      // Only fetch if we don't already have the data
      if (!priceComparisons[itemName]) {
        try {
          const comparisons = await getPriceComparison(itemName);
          setPriceComparisons(prev => ({
            ...prev,
            [itemName]: comparisons
          }));
        } catch (error) {
          console.error('Error fetching price comparisons:', error);
        }
      }
    }
  };

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  // Check if an item is about to expire (within 2 days)
  const isAboutToExpire = (date?: Date | null) => {
    if (!date) return false;
    const now = new Date();
    const expirationDate = new Date(date);
    const diffTime = expirationDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 2 && diffDays >= 0;
  };

  // Available categories
  const categories = [
    'Vegetables', 'Fruits', 'Meat', 'Seafood', 'Dairy', 
    'Grains', 'Bakery', 'Canned Goods', 'Frozen Foods', 
    'Snacks', 'Beverages', 'Condiments', 'Spices', 'Other'
  ];

  // Available stores
  const stores = ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'Kroger', 'Walmart', 'Target', 'Other'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <ShoppingBag className="mr-2" size={20} />
        Grocery List
      </h2>

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center p-3 mb-6 border-2 border-dashed border-gray-300 rounded-md hover:border-teal-500 hover:bg-teal-50 transition-colors"
        >
          <Plus size={20} className="mr-2 text-teal-500" />
          <span className="text-gray-600">Add a new item</span>
        </button>
      ) : (
        <form onSubmit={handleAddItem} className="mb-6 p-4 bg-gray-50 rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name*
              </label>
              <input
                id="itemName"
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., Organic Spinach"
              />
            </div>
            
            <div>
              <label htmlFor="itemCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="itemCategory"
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="itemPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                id="itemPrice"
                type="number"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                step="0.01"
                min="0"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label htmlFor="itemStore" className="block text-sm font-medium text-gray-700 mb-1">
                Store
              </label>
              <select
                id="itemStore"
                value={newItemStore}
                onChange={(e) => setNewItemStore(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select a store</option>
                {stores.map(store => (
                  <option key={store} value={store}>{store}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="itemExpDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <div className="flex items-center">
                <Calendar size={18} className="mr-2 text-gray-500" />
                <input
                  id="itemExpDate"
                  type="date"
                  value={newItemExpDate}
                  onChange={(e) => setNewItemExpDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
            >
              Add Item
            </button>
          </div>
        </form>
      )}

      {Object.keys(groupedItems).length === 0 ? (
        <p className="text-gray-500 text-center py-4">Your grocery list is empty.</p>
      ) : (
        Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">{category}</h3>
            <ul className="space-y-2">
              {categoryItems.map((item) => (
                <li key={item.id} className="border-b border-gray-100 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <button
                        onClick={() => onToggleItem(item.id)}
                        className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                          item.purchased ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}
                      >
                        {item.purchased && <Check size={12} className="text-white" />}
                      </button>
                      <span className={item.purchased ? 'line-through text-gray-400' : ''}>
                        {item.name}
                      </span>
                      {item.expirationDate && isAboutToExpire(item.expirationDate) && (
                        <span className="ml-2 text-red-500 flex items-center" title="Expiring soon!">
                          <AlertTriangle size={16} />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.price && (
                        <span className="text-gray-600 text-sm">${item.price.toFixed(2)}</span>
                      )}
                      {item.expirationDate && (
                        <span className="text-xs text-gray-500">
                          Exp: {format(new Date(item.expirationDate), 'MMM d')}
                        </span>
                      )}
                      {item.name && (
                        <button
                          onClick={() => togglePriceComparison(item.name)}
                          className="text-teal-500 hover:text-teal-700"
                          title="Compare prices"
                        >
                          <DollarSign size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove item"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  
                  {showPriceComparison === item.name && (
                    <div className="mt-2 ml-8 bg-gray-50 p-2 rounded-md">
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Price Comparison</h4>
                      {priceComparisons[item.name] ? (
                        <ul className="space-y-1">
                          {priceComparisons[item.name].map((comparison, index) => (
                            <li key={index} className="flex justify-between text-xs">
                              <span>{comparison.store}</span>
                              <span className={comparison.price === Math.min(...priceComparisons[item.name].map(c => c.price)) 
                                ? 'text-green-600 font-medium' 
                                : 'text-gray-600'
                              }>
                                ${comparison.price.toFixed(2)}
                                {comparison.price === Math.min(...priceComparisons[item.name].map(c => c.price)) && 
                                  ' (Best Price)'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex justify-center py-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-teal-500"></div>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default GroceryList;