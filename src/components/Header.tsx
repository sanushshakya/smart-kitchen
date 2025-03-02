import React from 'react';
import { ShoppingCart, Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ShoppingCart size={28} />
          <h1 className="text-2xl font-bold">Smart Grocery</h1>
        </div>
        
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-green-200 transition-colors">Home</a>
          <a href="#" className="hover:text-green-200 transition-colors">My Lists</a>
          <a href="#" className="hover:text-green-200 transition-colors">Preferences</a>
          <a href="#" className="hover:text-green-200 transition-colors">Budget</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className="hidden md:flex items-center space-x-2">
                <User size={18} />
                <span className="text-sm">{user.email}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-1 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </>
          )}
          <button className="md:hidden">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;