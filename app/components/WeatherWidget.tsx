'use client';
import { useState, useEffect } from 'react';

interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    description: string;
    icon: string;
  };
  forecast: Array<{
    date: number;
    temp: {
      min: number;
      max: number;
    };
    description: string;
    icon: string;
  }>;
}

// Weather icon components
const WeatherIcons = {
  ClearDay: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" className="fill-yellow-400" />
      <path className="fill-yellow-400" d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  ),
  ClearNight: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
      <path className="fill-blue-300" d="M9 6C9 10.97 13.03 15 18 15C18.39 15 18.77 14.97 19.14 14.91C17.93 17.27 15.46 19 12.5 19C8.36 19 5 15.64 5 11.5C5 8.54 6.73 6.07 9.09 4.86C9.03 5.23 9 5.61 9 6Z" />
    </svg>
  ),
  Clouds: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
      <path className="fill-gray-300 dark:fill-gray-400" d="M4.5 10H4C2.89543 10 2 10.8954 2 12V13C2 14.1046 2.89543 15 4 15H4.5C6.433 15 8 13.433 8 11.5C8 9.567 6.433 8 4.5 8C3.94772 8 3.5 8.44772 3.5 9V10Z" />
      <path className="fill-gray-400 dark:fill-gray-500" d="M12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12H20C21.1046 12 22 11.1046 22 10C22 8.89543 21.1046 8 20 8H19.5C17.567 8 16 6.433 16 4.5C16 2.567 17.567 1 19.5 1C20.0523 1 20.5 1.44772 20.5 2V3C20.5 3.55228 20.0523 4 19.5 4H12Z" />
    </svg>
  ),
  Rain: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
      <path className="fill-gray-400 dark:fill-gray-500" d="M4 14.5C2.067 14.5 0.5 12.933 0.5 11C0.5 9.067 2.067 7.5 4 7.5H4.5C6.433 7.5 8 9.067 8 11C8 12.933 6.433 14.5 4.5 14.5H4Z" />
      <path className="fill-gray-300 dark:fill-gray-400" d="M12 3.5C9.79086 3.5 8 5.29086 8 7.5C8 9.70914 9.79086 11.5 12 11.5H20C21.1046 11.5 22 10.6046 22 9.5C22 8.39543 21.1046 7.5 20 7.5H19.5C17.567 7.5 16 5.933 16 4C16 2.067 17.567 0.5 19.5 0.5C20.0523 0.5 20.5 0.947715 20.5 1.5V2.5C20.5 3.05228 20.0523 3.5 19.5 3.5H12Z" />
      <path className="fill-blue-400" d="M4 17L3 20M8 17L7 20M12 17L11 20M16 17L15 20M20 17L19 20" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Snow: () => (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
      <path className="fill-gray-400 dark:fill-gray-500" d="M4 14.5C2.067 14.5 0.5 12.933 0.5 11C0.5 9.067 2.067 7.5 4 7.5H4.5C6.433 7.5 8 9.067 8 11C8 12.933 6.433 14.5 4.5 14.5H4Z" />
      <path className="fill-gray-300 dark:fill-gray-400" d="M12 3.5C9.79086 3.5 8 5.29086 8 7.5C8 9.70914 9.79086 11.5 12 11.5H20C21.1046 11.5 22 10.6046 22 9.5C22 8.39543 21.1046 7.5 20 7.5H19.5C17.567 7.5 16 5.933 16 4C16 2.067 17.567 0.5 19.5 0.5C20.0523 0.5 20.5 0.947715 20.5 1.5V2.5C20.5 3.05228 20.0523 3.5 19.5 3.5H12Z" />
      <circle cx="4" cy="17" r="1" className="fill-blue-200" />
      <circle cx="8" cy="19" r="1" className="fill-blue-200" />
      <circle cx="12" cy="17" r="1" className="fill-blue-200" />
      <circle cx="16" cy="19" r="1" className="fill-blue-200" />
      <circle cx="20" cy="17" r="1" className="fill-blue-200" />
    </svg>
  )
};

function getWeatherIcon(code: string) {
  // Map OpenWeather icon codes to our custom icons
  if (code.startsWith('01')) {
    return code.endsWith('d') ? <WeatherIcons.ClearDay /> : <WeatherIcons.ClearNight />;
  }
  if (code.startsWith('02') || code.startsWith('03') || code.startsWith('04')) {
    return <WeatherIcons.Clouds />;
  }
  if (code.startsWith('09') || code.startsWith('10')) {
    return <WeatherIcons.Rain />;
  }
  if (code.startsWith('13')) {
    return <WeatherIcons.Snow />;
  }
  // Default to clear day if unknown
  return <WeatherIcons.ClearDay />;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        // Brugg coordinates
        const lat = 47.4814;
        const lon = 8.2079;
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch weather data');
        }
        
        setWeather(data);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        console.error('Weather widget error:', err);
        setError(err instanceof Error ? err.message : 'Could not load weather data');
        if (retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, Math.pow(2, retryCount) * 1000);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000);
    return () => clearInterval(interval);
  }, [retryCount]);

  if (loading) {
    return (
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
        <div className="animate-pulse flex flex-col gap-4">
          {/* Current Weather Loading */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div>
                <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Forecast Loading */}
          <div className="grid grid-cols-3 gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white/30 dark:bg-gray-700/30 rounded-lg p-2">
                <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14">
              {getWeatherIcon(weather.current.icon)}
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {Math.round(weather.current.temp)}°C
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                {weather.current.description}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Feels like {Math.round(weather.current.feels_like)}°C</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>Humidity {weather.current.humidity}%</span>
            </div>
          </div>
        </div>

        {/* Forecast */}
        {weather.forecast.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {weather.forecast.map((day, index) => (
              <div key={index} className="bg-white/30 dark:bg-gray-700/30 rounded-lg p-2">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {Math.round(day.temp.max)}°
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {Math.round(day.temp.min)}°
                    </span>
                  </div>
                  <div className="w-8 h-8">
                    {getWeatherIcon(day.icon)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 