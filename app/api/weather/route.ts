import { NextRequest, NextResponse } from 'next/server';

interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}

interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp_min: number;
      temp_max: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
}

interface WeatherResponse {
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
  timestamp: number;
}

// Server-side cache
type CacheRecord = {
  data: WeatherResponse;
  expires: number;
};

const cache = new Map<string, CacheRecord>();
// Server-side cache duration (10 minutes)
const CACHE_DURATION = 10 * 60 * 1000;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const cacheKey = `weather-${lat}-${lon}`;
    const now = Date.now();

    // Check if we have valid cached data
    const cachedRecord = cache.get(cacheKey);
    if (cachedRecord && cachedRecord.expires > now) {
      // Set cache headers to inform client about remaining cache time
      const maxAge = Math.floor((cachedRecord.expires - now) / 1000);
      return NextResponse.json(cachedRecord.data, {
        headers: {
          'Cache-Control': `public, max-age=${maxAge}`,
        },
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenWeather API key is not configured' },
        { status: 500 }
      );
    }

    // Fetch current weather
    const currentRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!currentRes.ok) {
      throw new Error(`Weather API returned ${currentRes.status}`);
    }
    const currentData: OpenWeatherResponse = await currentRes.json();

    // Fetch forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!forecastRes.ok) {
      throw new Error(`Forecast API returned ${forecastRes.status}`);
    }
    const forecastData: OpenWeatherForecastResponse = await forecastRes.json();

    // Process forecast data to get daily values
    const dailyForecasts = forecastData.list
      .filter((item, index) => index % 8 === 0) // Get one reading per day (every 8th item is 24h apart)
      .slice(0, 5) // Get next 5 days
      .map(day => ({
        date: day.dt * 1000, // Convert to milliseconds
        temp: {
          min: Math.round(day.main.temp_min),
          max: Math.round(day.main.temp_max)
        },
        description: day.weather[0].description,
        icon: day.weather[0].icon
      }));

    // Format response
    const response: WeatherResponse = {
      current: {
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon
      },
      forecast: dailyForecasts,
      timestamp: now
    };

    // Cache the response
    cache.set(cacheKey, {
      data: response,
      expires: now + CACHE_DURATION
    });

    // Clean up old cache entries
    for (const [key, record] of cache.entries()) {
      if (record.expires < now) {
        cache.delete(key);
      }
    }

    // Set cache headers
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_DURATION / 1000}`,
      },
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}