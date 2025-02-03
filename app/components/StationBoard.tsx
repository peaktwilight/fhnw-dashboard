'use client';

import { useState, useEffect } from 'react';

interface Departure {
  stop: {
    departure: string;
    platform: string;
    prognosis: {
      departure: string | null;
      platform: string | null;
    };
  };
  name: string;
  category: string;
  to: string;
}

export default function StationBoard() {
  const [departures, setDepartures] = useState<Departure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDepartures() {
      try {
        setLoading(true);
        const response = await fetch(
          'https://transport.opendata.ch/v1/stationboard?station=Brugg&limit=6'
        );
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error('Failed to fetch departures');
        }
        
        setDepartures(data.stationboard);
        setError(null);
      } catch (err) {
        console.error('StationBoard error:', err);
        setError('Could not load departure information');
      } finally {
        setLoading(false);
      }
    }

    fetchDepartures();
    // Refresh every 30 seconds
    const interval = setInterval(fetchDepartures, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
        <div className="animate-pulse space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="w-8 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
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

  if (!departures || departures.length === 0) {
    return (
      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No departures available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
      <div className="space-y-3">
        {departures.map((departure, index) => {
          const scheduledTime = new Date(departure.stop.departure);
          const prognosisTime = departure.stop.prognosis.departure 
            ? new Date(departure.stop.prognosis.departure)
            : null;
          
          const delay = prognosisTime 
            ? Math.round((prognosisTime.getTime() - scheduledTime.getTime()) / 60000)
            : 0;

          return (
            <div 
              key={index}
              className="flex items-center gap-3 text-sm"
            >
              <div className="w-16 font-medium">
                {scheduledTime.toLocaleTimeString('de-CH', { 
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {delay > 0 && (
                  <span className="text-red-600 dark:text-red-400 text-xs ml-1">
                    +{delay}
                  </span>
                )}
              </div>
              <div className="w-8 text-center">
                {departure.stop.platform && (
                  <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs">
                    {departure.stop.platform}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs min-w-[2rem] text-center">
                  {departure.category}
                </span>
                <span className="text-gray-900 dark:text-white truncate">
                  {departure.to}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 