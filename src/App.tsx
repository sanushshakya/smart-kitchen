import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import UserPreferences from "./components/UserPreferences";
import GroceryList from "./components/GroceryList";
import AiSuggestions from "./components/AiSuggestions";
import BudgetOptimizer from "./components/BudgetOptimizer";
import ExpirationAlerts from "./components/ExpirationAlerts";
import Auth from "./components/Auth";
import { GroceryItem, UserPreference } from "./types";
import { useAuth } from "./context/AuthContext";
import {
  fetchGroceryItems,
  addGroceryItem,
  updateGroceryItem,
  deleteGroceryItem,
  fetchUserPreferences,
  updateUserPreferences,
} from "./services/groceryService";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

function App() {
  const { user, loading } = useAuth();
  const [userPreferences, setUserPreferences] = useState<UserPreference>({
    dietaryPreferences: [],
    allergies: [],
    fitnessGoals: [],
    budget: 100,
  });
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data when user is authenticated
    const loadUserData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Load user preferences
        const preferences = await fetchUserPreferences(user.id);
        setUserPreferences(preferences);

        // Load grocery items
        const items = await fetchGroceryItems(user.id);
        setGroceryItems(items);
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load your data");
      } finally {
        setIsLoading(false);
      }
    };

    if (user && !loading) {
      loadUserData();
    } else if (!loading) {
      setIsLoading(false);
    }
  }, [user, loading]);

  const handleAddItem = async (item: GroceryItem) => {
    if (!user) return;

    // Check if item already exists
    const existingItem = groceryItems.find(
      (i) => i.name.toLowerCase() === item.name.toLowerCase()
    );
    if (existingItem) {
      toast.error("This item already exists in your list");
      return;
    }

    try {
      // Create a new item with a UUID
      const newItem = {
        ...item,
        id: uuidv4(),
        user_id: user.id,
      };

      // Add to database
      const addedItem = await addGroceryItem(user.id, newItem);

      // Update local state
      setGroceryItems((prev) => [...prev, addedItem]);
      toast.success(`Added ${item.name} to your list`);
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    }
  };

  const handleToggleItem = async (id: string) => {
    if (!user) return;

    try {
      // Find the item to toggle
      const itemToToggle = groceryItems.find((item) => item.id === id);
      if (!itemToToggle) return;

      // Create updated item
      const updatedItem = {
        ...itemToToggle,
        purchased: !itemToToggle.purchased,
      };

      // Update in database
      await updateGroceryItem(updatedItem);

      // Update local state
      setGroceryItems(
        groceryItems.map((item) =>
          item.id === id ? { ...item, purchased: !item.purchased } : item
        )
      );
    } catch (error) {
      console.error("Error toggling item:", error);
      toast.error("Failed to update item");
    }
  };

  const handleRemoveItem = async (id: string) => {
    if (!user) return;

    try {
      // Delete from database
      await deleteGroceryItem(id);

      // Update local state
      setGroceryItems(groceryItems.filter((item) => item.id !== id));
      toast.success("Item removed");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleSavePreferences = async (newPreferences: UserPreference) => {
    if (!user) return;

    try {
      // Update in database
      await updateUserPreferences(user.id, newPreferences);

      // Update local state
      setUserPreferences(newPreferences);
      toast.success("Preferences saved");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    }
  };

  // If not authenticated, show auth screen
  if (!user && !loading) {
    return <Auth />;
  }

  // Show loading state
  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UserPreferences
              preferences={userPreferences}
              onSave={handleSavePreferences}
            />

            <GroceryList
              items={groceryItems}
              onAddItem={handleAddItem}
              onToggleItem={handleToggleItem}
              onRemoveItem={handleRemoveItem}
            />
          </div>

          <div className="space-y-6">
            <AiSuggestions
              userPreferences={userPreferences}
              onAddItem={handleAddItem}
            />

            <BudgetOptimizer
              items={groceryItems}
              budget={userPreferences.budget}
            />

            <ExpirationAlerts items={groceryItems} />
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6 mt-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400">
            © 2025 Smart Grocery Shopping App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
