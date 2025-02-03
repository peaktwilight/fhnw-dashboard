import { NextRequest, NextResponse } from 'next/server';

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

    // Fetch current weather and forecast data in parallel
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      )
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const [currentData, forecastData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json()
    ]);

    // Get unique days from forecast (excluding today)
    const today = new Date().setHours(0, 0, 0, 0);
    const uniqueDays = forecastData.list.reduce((acc: any[], item: any) => {
      const date = new Date(item.dt * 1000).setHours(0, 0, 0, 0);
      if (date > today && !acc.find((d: any) => d.date === date)) {
        acc.push({
          date,
          temp: {
            min: item.main.temp_min,
            max: item.main.temp_max
          },
          description: item.weather[0].description,
          icon: item.weather[0].icon
        });
      }
      return acc;
    }, []).slice(0, 3); // Get next 3 days

    // Format the response
    const weatherData = {
      current: {
        temp: currentData.main.temp,
        feels_like: currentData.main.feels_like,
        humidity: currentData.main.humidity,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
      },
      forecast: uniqueDays
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
} 