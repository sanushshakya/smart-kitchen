import React from 'react';
import { GroceryItem } from '../types';
import { format, differenceInDays } from 'date-fns';
import { Clock, AlertTriangle } from 'lucide-react';

interface ExpirationAlertsProps {
  items: GroceryItem[];
}

const ExpirationAlerts: React.FC<ExpirationAlertsProps> = ({ items }) => {
  // Filter items that have an expiration date and are purchased
  const itemsWithExpiration = items.filter(
    (item) => item.expirationDate && item.purchased
  );
  
  // Sort by expiration date (soonest first)
  const sortedItems = [...itemsWithExpiration].sort((a, b) => {
    if (!a.expirationDate || !b.expirationDate) return 0;
    return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
  });
  
  // Get items expiring soon (within 5 days)
  const expiringSoon = sortedItems.filter((item) => {
    if (!item.expirationDate) return false;
    const daysUntilExpiration = differenceInDays(
      new Date(item.expirationDate),
      new Date()
    );
    return daysUntilExpiration >= 0 && daysUntilExpiration <= 5;
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Clock className="mr-2" size={20} />
        Expiration Alerts
      </h2>
      
      {expiringSoon.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No items are expiring soon.</p>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            The following items will expire soon:
          </p>
          
          <ul className="space-y-3">
            {expiringSoon.map((item) => {
              if (!item.expirationDate) return null;
              
              const daysUntilExpiration = differenceInDays(
                new Date(item.expirationDate),
                new Date()
              );
              
              let alertClass = 'bg-yellow-50 border-yellow-200';
              if (daysUntilExpiration <= 1) {
                alertClass = 'bg-red-50 border-red-200';
              } else if (daysUntilExpiration <= 3) {
                alertClass = 'bg-orange-50 border-orange-200';
              }
              
              return (
                <li 
                  key={item.id}
                  className={`border rounded-md p-3 ${alertClass}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {daysUntilExpiration <= 1 && (
                        <AlertTriangle size={16} className="text-red-500 mr-2" />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-sm">
                      {daysUntilExpiration === 0 ? (
                        <span className="text-red-600 font-medium">Expires today!</span>
                      ) : daysUntilExpiration === 1 ? (
                        <span className="text-red-600">Expires tomorrow</span>
                      ) : (
                        <span className="text-gray-600">
                          Expires in {daysUntilExpiration} days
                          <span className="ml-1 text-xs">
                            ({format(new Date(item.expirationDate), 'MMM d')})
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Tip: Use or freeze items before they expire to reduce food waste.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpirationAlerts;