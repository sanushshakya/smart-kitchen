import React, { useState, useEffect } from 'react';
import { GroceryItem } from '../types';
import { getOptimizedShoppingPlan } from '../services/aiService';
import { TrendingUp, ShoppingBag, RefreshCw } from 'lucide-react';

interface BudgetOptimizerProps {
  items: GroceryItem[];
  budget: number;
}

const BudgetOptimizer: React.FC<BudgetOptimizerProps> = ({ items, budget }) => {
  const [shoppingPlan, setShoppingPlan] = useState<{ store: string; items: any[]; totalCost: number }[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadShoppingPlan = async () => {
    setLoading(true);
    try {
      const plan = await getOptimizedShoppingPlan(items);
      setShoppingPlan(plan);
      setTotalCost(plan.reduce((sum, store) => sum + store.totalCost, 0));
    } catch (error) {
      console.error('Error loading shopping plan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShoppingPlan();
  }, [items]);

  const isOverBudget = totalCost > budget;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <TrendingUp className="mr-2" size={20} />
          Budget Optimizer
        </h2>
        <button 
          onClick={loadShoppingPlan}
          disabled={loading}
          className="p-2 text-teal-600 hover:text-teal-800 transition-colors"
          title="Refresh shopping plan"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Weekly Budget:</span>
          <span className="font-medium">${budget.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Estimated Total:</span>
          <span className={`font-medium ${isOverBudget ? 'text-red-500' : 'text-green-500'}`}>
            ${totalCost.toFixed(2)}
          </span>
        </div>
        
        {isOverBudget && (
          <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
            You're ${(totalCost - budget).toFixed(2)} over your weekly budget.
          </div>
        )}
      </div>
      
      <h3 className="font-medium text-gray-700 mb-3">Optimized Shopping Plan</h3>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : shoppingPlan.length === 0 ? (
        <p className="text-gray-500 text-center py-4">Add unpurchased items to your grocery list to see an optimized shopping plan.</p>
      ) : (
        <div className="space-y-4">
          {shoppingPlan.map((store, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium flex items-center">
                  <ShoppingBag size={16} className="mr-1" />
                  {store.store}
                </h4>
                <span className="text-sm font-medium">${store.totalCost.toFixed(2)}</span>
              </div>
              
              <ul className="space-y-1">
                {store.items.map((item: GroceryItem) => (
                  <li key={item.id} className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-gray-600">${item.price?.toFixed(2) || '0.00'}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetOptimizer;