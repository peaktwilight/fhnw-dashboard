import { useState, useEffect } from 'react';
import { DailyMenu, MenuItem, ALLERGEN_MAP } from '../types/menu';
import { getMenu } from '../services/menuService';
import { format, addDays, subDays, isWeekend } from 'date-fns';
import { de } from 'date-fns/locale';

export default function MenuDisplay() {
  const [menu, setMenu] = useState<DailyMenu | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    async function fetchMenu() {
      try {
        setLoading(true);
        const data = await getMenu(selectedDate);
        setMenu(data);
        setError(null);
      } catch (err) {
        setError('Failed to load menu data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, [selectedDate]);

  const handlePreviousDay = () => {
    let newDate = subDays(selectedDate, 1);
    // Skip weekends when going backwards
    while (isWeekend(newDate)) {
      newDate = subDays(newDate, 1);
    }
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    let newDate = addDays(selectedDate, 1);
    // Skip weekends when going forwards
    while (isWeekend(newDate)) {
      newDate = addDays(newDate, 1);
    }
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    const today = new Date();
    // If today is a weekend, go to next Monday
    if (isWeekend(today)) {
      let nextWorkday = today;
      while (isWeekend(nextWorkday)) {
        nextWorkday = addDays(nextWorkday, 1);
      }
      setSelectedDate(nextWorkday);
    } else {
      setSelectedDate(today);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  );
  
  if (error) return (
    <div className="p-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
      <p className="font-medium">Fehler beim Laden des Menüs</p>
      <p className="text-sm mt-1">{error}</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-2 px-4 py-2 text-sm bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100 rounded hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
      >
        Neu laden
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
            Mensa Menü
          </h2>
          <a 
            href="https://fhnw.sv-restaurant.ch/de/menuplan/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          >
            <span className="hidden sm:inline">Official Website</span>
            <span className="sm:hidden">Menu</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1 max-w-full overflow-x-auto">
          <button
            onClick={handlePreviousDay}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0"
            title="Vorheriger Tag"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleToday}
            className="px-3 sm:px-4 py-2 mx-2 text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shrink-0"
          >
            Heute
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[120px] sm:min-w-[180px] text-center font-medium whitespace-nowrap px-2">
            {format(selectedDate, 'EEEE, d. MMMM', { locale: de })}
          </span>
          <button
            onClick={handleNextDay}
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 shrink-0"
            title="Nächster Tag"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      {(!menu || menu.items.length === 0) ? (
        <div className="card text-center transform transition-all hover:scale-[1.01] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
          <p>Kein Menü verfügbar für {format(selectedDate, 'EEEE, d. MMMM', { locale: de })}</p>
          <p className="text-sm mt-1">Bitte wählen Sie einen anderen Tag oder versuchen Sie es später erneut.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menu.items.map((item: MenuItem, index: number) => (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                {/* Title and Labels */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                  <div className="flex gap-1">
                    {item.isVegan && (
                      <span className="relative z-20 px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-100 text-xs rounded-full ring-1 ring-green-200 dark:ring-green-800">
                        V
                      </span>
                    )}
                    {item.isVegetarian && !item.isVegan && (
                      <span className="relative z-20 px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-100 text-xs rounded-full ring-1 ring-green-200 dark:ring-green-800">
                        Veg
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {item.description}
                </p>

                {/* Origin if available */}
                {item.origin && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    Origin: {item.origin}
                  </p>
                )}

                {/* Prices */}
                <div className="flex justify-between text-sm mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                  <span>
                    <span className="font-medium text-gray-900 dark:text-white">Student:</span>
                    <span className="ml-1 text-gray-600 dark:text-gray-300">CHF {item.prices.student.toFixed(2)}</span>
                  </span>
                  <span>
                    <span className="font-medium text-gray-900 dark:text-white">Regular:</span>
                    <span className="ml-1 text-gray-600 dark:text-gray-300">CHF {item.prices.regular.toFixed(2)}</span>
                  </span>
                </div>

                {/* Nutrition Info */}
                {item.nutritionInfo && (
                  <div className="grid grid-cols-4 gap-2 text-xs mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">{item.nutritionInfo.kcal}</div>
                      <div className="text-gray-500 dark:text-gray-400">kcal</div>
                      {item.nutritionInfo.percentages?.kcal && (
                        <div className="text-gray-400">{item.nutritionInfo.percentages.kcal}%</div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">{item.nutritionInfo.carbs}g</div>
                      <div className="text-gray-500 dark:text-gray-400">Carbs</div>
                      {item.nutritionInfo.percentages?.carbs && (
                        <div className="text-gray-400">{item.nutritionInfo.percentages.carbs}%</div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">{item.nutritionInfo.protein}g</div>
                      <div className="text-gray-500 dark:text-gray-400">Protein</div>
                      {item.nutritionInfo.percentages?.protein && (
                        <div className="text-gray-400">{item.nutritionInfo.percentages.protein}%</div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">{item.nutritionInfo.fat}g</div>
                      <div className="text-gray-500 dark:text-gray-400">Fat</div>
                      {item.nutritionInfo.percentages?.fat && (
                        <div className="text-gray-400">{item.nutritionInfo.percentages.fat}%</div>
                      )}
                    </div>
                  </div>
                )}

                {/* Allergens */}
                {item.allergens.length > 0 && (
                  <div className="text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Allergene: </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.allergens.map((allergen, i) => (
                        <span
                          key={i}
                          className="relative z-20 inline-flex items-center px-2 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-100 rounded-md text-xs transition-colors hover:bg-yellow-100 dark:hover:bg-yellow-900/50 ring-1 ring-yellow-200/50 dark:ring-yellow-800/50"
                        >
                          {allergen === "1" && "🌾"}
                          {allergen === "2" && "🦐"}
                          {allergen === "3" && "🥚"}
                          {allergen === "4" && "🐟"}
                          {allergen === "5" && "🥜"}
                          {allergen === "6" && "🫘"}
                          {allergen === "7" && "🥛"}
                          {allergen === "8" && "🌰"}
                          {allergen === "9" && "🥬"}
                          {allergen === "10" && "🟡"}
                          {allergen === "11" && "⚪"}
                          {allergen === "12" && "⚡"}
                          {allergen === "13" && "🌱"}
                          {allergen === "14" && "🦑"}
                          <span className="ml-1">{ALLERGEN_MAP[allergen]}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 