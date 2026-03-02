import { WeatherData, WeatherApiResponse, WeatherCondition, ForecastData } from '@/types/weather';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function mapWeatherCondition(main: string): WeatherCondition {
  const conditionMap: Record<string, WeatherCondition> = {
    'Clear': 'clear',
    'Clouds': 'clouds',
    'Rain': 'rain',
    'Drizzle': 'drizzle',
    'Thunderstorm': 'thunderstorm',
    'Snow': 'snow',
    'Mist': 'mist',
    'Fog': 'fog',
    'Haze': 'mist',
    'Smoke': 'mist',
    'Dust': 'mist',
    'Sand': 'mist',
    'Ash': 'mist',
    'Squall': 'rain',
    'Tornado': 'thunderstorm',
  };
  return conditionMap[main] || 'clear';
}

export async function fetchCurrentWeather(
  city: string = 'London'
): Promise<WeatherData> {
  // For demo purposes, return mock data if no API key
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return getMockWeatherData(city);
  }

  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`City "${city}" not found`);
    }
    throw new Error('Failed to fetch weather data');
  }

  const data: WeatherApiResponse = await response.json();

  return {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    condition: mapWeatherCondition(data.weather[0]?.main || 'Clear'),
    description: data.weather[0]?.description || 'clear sky',
    icon: data.weather[0]?.icon || '01d',
    timestamp: data.dt * 1000,
  };
}

export async function fetchWeatherByCoords(
  lat: number,
  lon: number
): Promise<WeatherData> {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return getMockWeatherData('Current Location');
  }

  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data: WeatherApiResponse = await response.json();

  return {
    city: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    condition: mapWeatherCondition(data.weather[0]?.main || 'Clear'),
    description: data.weather[0]?.description || 'clear sky',
    icon: data.weather[0]?.icon || '01d',
    timestamp: data.dt * 1000,
  };
}

function getMockWeatherData(city: string): WeatherData {
  return {
    city: city,
    country: 'GB',
    temperature: 18,
    feelsLike: 16,
    humidity: 65,
    windSpeed: 4.2,
    condition: 'clouds',
    description: 'scattered clouds',
    icon: '03d',
    timestamp: Date.now(),
  };
}

export interface ForecastApiResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
  city: {
    name: string;
    country: string;
  };
}

export async function fetch5DayForecast(
  city: string = 'London'
): Promise<ForecastData[]> {
  // For demo purposes, return mock data if no API key
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return getMockForecastData(city);
  }

  const response = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`City "${city}" not found`);
    }
    throw new Error('Failed to fetch forecast data');
  }

  const data: ForecastApiResponse = await response.json();

  // Group by day and get one forecast per day (noon)
  const dailyForecasts: ForecastData[] = [];
  const seenDays = new Set<string>();

  for (const item of data.list) {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!seenDays.has(date) && dailyForecasts.length < 5) {
      seenDays.add(date);
      dailyForecasts.push({
        date: new Date(item.dt * 1000).toISOString(),
        temperature: item.main.temp,
        minTemp: item.main.temp_min,
        maxTemp: item.main.temp_max,
        condition: mapWeatherCondition(item.weather[0]?.main || 'Clear'),
        description: item.weather[0]?.description || 'clear sky',
        icon: item.weather[0]?.icon || '01d',
        humidity: item.main.humidity,
        windSpeed: item.wind.speed,
      });
    }
  }

  return dailyForecasts;
}

function getMockForecastData(_city: string): ForecastData[] {
  const forecasts: ForecastData[] = [];
  const conditions: WeatherCondition[] = ['clear', 'clouds', 'rain', 'clouds', 'clear'];
  const icons = ['01d', '03d', '10d', '03d', '01d'];
  
  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    forecasts.push({
      date: date.toISOString(),
      temperature: 15 + Math.random() * 10,
      minTemp: 10 + Math.random() * 5,
      maxTemp: 20 + Math.random() * 5,
      condition: conditions[i],
      description: conditions[i] + ' sky',
      icon: icons[i],
      humidity: 60 + Math.random() * 20,
      windSpeed: 3 + Math.random() * 5,
    });
  }
  return forecasts;
}
