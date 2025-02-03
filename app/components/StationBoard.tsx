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
  operator: string;
  number: string;
  passList?: Array<{
    station: {
      name: string;
    };
    arrival: string | null;
    departure: string | null;
  }>;
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
          'https://transport.opendata.ch/v1/stationboard?station=Brugg&limit=6&show_tracks=1&show_delays=1&show_intermediate_stops=1'
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

          // Get intermediate stops (max 3)
          const intermediateStops = departure.passList
            ?.slice(1, -1)
            .slice(0, 3)
            .map(stop => ({
              name: stop.station.name,
              arrival: stop.arrival ? new Date(stop.arrival).toLocaleTimeString('de-CH', { 
                hour: '2-digit',
                minute: '2-digit'
              }) : null
            })) || [];

          // Format train name for display
          const trainName = departure.category === departure.name 
            ? `${departure.category}${departure.number}`
            : departure.name;

          // Determine train type icon
          const getTrainIcon = (category: string) => {
            switch(category.toLowerCase()) {
              case 'ir':
                return (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                );
              case 's':
                return (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                );
              default:
                return (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                );
            }
          };

          return (
            <div 
              key={index}
              className="bg-white/30 dark:bg-gray-700/30 rounded-lg p-3 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex flex-col gap-3">
                {/* Top row: Time, Platform, and Train Category */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Time */}
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-base font-medium">
                        {scheduledTime.toLocaleTimeString('de-CH', { 
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>

                    {/* Platform */}
                    {departure.stop.platform && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded font-medium">
                          <span className="text-gray-600 dark:text-gray-300">Gleis </span>
                          {departure.stop.platform}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Train Category and Number */}
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded font-medium">
                      {getTrainIcon(departure.category)}
                      {departure.category}
                    </span>
                    <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">
                      {trainName}
                    </span>
                  </div>
                </div>

                {/* Middle row: Route Information (Desktop only) */}
                <div className="hidden sm:flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    {/* Operator */}
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      <span>{departure.operator}</span>
                    </div>

                    {/* Via Stations */}
                    {intermediateStops.length > 0 && (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span>
                          {intermediateStops.map((stop, i) => (
                            <span key={stop.name}>
                              {i > 0 && " → "}
                              <span className="whitespace-nowrap">
                                {stop.name}
                                {stop.arrival && (
                                  <span className="text-xs ml-1 text-gray-500">
                                    ({stop.arrival})
                                  </span>
                                )}
                              </span>
                            </span>
                          ))}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom row: Destination and Delay */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-gray-900 dark:text-white min-w-0">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <span className="font-medium truncate">
                      {departure.to}
                    </span>
                  </div>

                  {delay > 0 && (
                    <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 whitespace-nowrap ml-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">+{delay} min</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 