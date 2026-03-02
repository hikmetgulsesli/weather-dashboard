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

import { ForecastData, ForecastApiResponse, ForecastApiItem } from '@/types/weather';

export async function fetchForecast(
  city: string = 'London'
): Promise<ForecastData[]> {
  // For demo purposes, return mock data if no API key
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return getMockForecastData();
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
  return groupForecastByDay(data.list);
}

export async function fetchForecastByCoords(
  lat: number,
  lon: number
): Promise<ForecastData[]> {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    return getMockForecastData();
  }

  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }

  const data: ForecastApiResponse = await response.json();
  return groupForecastByDay(data.list);
}

function groupForecastByDay(forecastList: ForecastApiItem[]): ForecastData[] {
  const dailyData = new Map<string, ForecastApiItem[]>();

  // Group by date
  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyData.has(date)) {
      dailyData.set(date, []);
    }
    dailyData.get(date)!.push(item);
  });

  // Process each day
  const result: ForecastData[] = [];
  const sortedDates = Array.from(dailyData.keys()).sort();

  // Skip today, take next 5 days
  for (let i = 1; i < Math.min(6, sortedDates.length); i++) {
    const date = sortedDates[i];
    const items = dailyData.get(date)!;
    
    // Find min/max temps
    let minTemp = Infinity;
    let maxTemp = -Infinity;
    let totalHumidity = 0;
    let totalWindSpeed = 0;
    let maxPop = 0;
    
    // Use midday forecast for main condition (around 12:00)
    let mainItem = items[0];
    let closestToMidday = Infinity;
    
    items.forEach((item) => {
      minTemp = Math.min(minTemp, item.main.temp_min);
      maxTemp = Math.max(maxTemp, item.main.temp_max);
      totalHumidity += item.main.humidity;
      totalWindSpeed += item.wind.speed;
      maxPop = Math.max(maxPop, item.pop || 0);
      
      // Find item closest to midday (12:00 = 43200 seconds from midnight)
      const itemHour = new Date(item.dt * 1000).getHours();
      const distanceFromMidday = Math.abs(itemHour - 12);
      if (distanceFromMidday < closestToMidday) {
        closestToMidday = distanceFromMidday;
        mainItem = item;
      }
    });

    result.push({
      date,
      temperature: mainItem.main.temp,
      minTemp,
      maxTemp,
      condition: mapWeatherCondition(mainItem.weather[0]?.main || 'Clear'),
      description: mainItem.weather[0]?.description || 'clear sky',
      icon: mainItem.weather[0]?.icon || '01d',
      humidity: Math.round(totalHumidity / items.length),
      windSpeed: totalWindSpeed / items.length,
      precipitationChance: Math.round(maxPop * 100),
    });
  }

  return result;
}

function getMockForecastData(): ForecastData[] {
  const today = new Date();
  const conditions: Array<{ condition: WeatherCondition; description: string; icon: string }> = [
    { condition: 'clear', description: 'clear sky', icon: '01d' },
    { condition: 'clouds', description: 'scattered clouds', icon: '03d' },
    { condition: 'rain', description: 'light rain', icon: '10d' },
    { condition: 'clouds', description: 'broken clouds', icon: '04d' },
    { condition: 'clear', description: 'few clouds', icon: '02d' },
  ];

  return Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i + 1);
    const condition = conditions[i];
    
    return {
      date: date.toISOString().split('T')[0],
      temperature: 15 + Math.random() * 10,
      minTemp: 10 + Math.random() * 5,
      maxTemp: 18 + Math.random() * 8,
      condition: condition.condition,
      description: condition.description,
      icon: condition.icon,
      humidity: 50 + Math.floor(Math.random() * 30),
      windSpeed: 2 + Math.random() * 5,
      precipitationChance: condition.condition === 'rain' ? 70 : Math.floor(Math.random() * 30),
    };
  });
}
