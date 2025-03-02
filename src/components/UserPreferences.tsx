import React, { useState } from 'react';
import { UserPreference } from '../types';
import { User, Settings } from 'lucide-react';

interface UserPreferencesProps {
  preferences: UserPreference;
  onSave: (preferences: UserPreference) => void;
}

const UserPreferences: React.FC<UserPreferencesProps> = ({ preferences, onSave }) => {
  const [editedPreferences, setEditedPreferences] = useState<UserPreference>(preferences);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'budget') {
      setEditedPreferences({
        ...editedPreferences,
        [name]: parseFloat(value),
      });
    } else if (name === 'dietaryPreferences' || name === 'allergies' || name === 'fitnessGoals') {
      setEditedPreferences({
        ...editedPreferences,
        [name]: value.split(',').map(item => item.trim()).filter(item => item !== ''),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedPreferences);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <User className="mr-2" size={20} />
          Your Preferences
        </h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
        >
          <Settings size={16} className="mr-1" />
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dietary Preferences (comma separated)
            </label>
            <input
              type="text"
              name="dietaryPreferences"
              value={editedPreferences.dietaryPreferences.join(', ')}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="e.g., vegetarian, low-carb, keto"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allergies (comma separated)
            </label>
            <input
              type="text"
              name="allergies"
              value={editedPreferences.allergies.join(', ')}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="e.g., peanuts, shellfish, gluten"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fitness Goals (comma separated)
            </label>
            <input
              type="text"
              name="fitnessGoals"
              value={editedPreferences.fitnessGoals.join(', ')}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="e.g., weight loss, muscle gain, endurance"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Budget ($)
            </label>
            <input
              type="number"
              name="budget"
              value={editedPreferences.budget}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Save Preferences
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Dietary Preferences</h3>
            <p className="text-gray-800">
              {preferences.dietaryPreferences.length > 0 
                ? preferences.dietaryPreferences.join(', ') 
                : 'None specified'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
            <p className="text-gray-800">
              {preferences.allergies.length > 0 
                ? preferences.allergies.join(', ') 
                : 'None specified'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Fitness Goals</h3>
            <p className="text-gray-800">
              {preferences.fitnessGoals.length > 0 
                ? preferences.fitnessGoals.join(', ') 
                : 'None specified'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Weekly Budget</h3>
            <p className="text-gray-800">${preferences.budget.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPreferences;