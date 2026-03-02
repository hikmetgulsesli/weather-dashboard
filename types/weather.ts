export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
  timestamp: number;
}

export type WeatherCondition = 
  | 'clear' 
  | 'clouds' 
  | 'rain' 
  | 'drizzle' 
  | 'thunderstorm' 
  | 'snow' 
  | 'mist' 
  | 'fog';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface WeatherApiResponse {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  dt: number;
}

export interface ForecastData {
  date: string;
  temperature: number;
  minTemp: number;
  maxTemp: number;
  condition: WeatherCondition;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitationChance: number;
}

export interface ForecastApiItem {
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
  pop: number;
}

export interface ForecastApiResponse {
  list: ForecastApiItem[];
  city: {
    name: string;
    country: string;
  };
}
