import { WeatherData, WeatherApiResponse, WeatherCondition } from '@/types/weather';

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
