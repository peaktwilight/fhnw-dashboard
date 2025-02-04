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
    const currentData: OpenWeatherResponse = await currentRes.json();

    // Fetch forecast
    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
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
    const response = {
      current: {
        temp: Math.round(currentData.main.temp),
        feels_like: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon
      },
      forecast: dailyForecasts
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
} 