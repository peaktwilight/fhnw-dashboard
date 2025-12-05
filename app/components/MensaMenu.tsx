'use client';
import { useState, useEffect } from 'react';

interface MenuItem {
  title: string;
  description: string;
  price: string;
  isVegan?: boolean;
  isVegetarian?: boolean;
  allergenes?: string[];
}

export default function MensaMenu() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you'd fetch from an API
    // For now, we'll show a static example
    const fetchMenu = async () => {
      try {
        // TODO: Implement actual fetch from SV website
        // For now using example data
        const exampleMenu = [
          {
            title: "Today's Menu",
            description: "Check menu at SV Restaurant",
            price: "",
          }
        ];
        setMenu(exampleMenu);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Mensa Menu</h2>
        <a 
          href="https://fhnw.sv-restaurant.ch/de/menuplan/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-orange-500 dark:text-orange-400 hover:underline"
        >
          View Full Menu →
        </a>
      </div>
      
      {loading ? (
        <div className="animate-pulse flex flex-col space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {menu.map((item, index) => (
            <div key={index} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <h3 className="font-medium text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
              {item.price && (
                <p className="text-sm font-medium text-slate-900 dark:text-white mt-2">
                  {item.price} CHF
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 