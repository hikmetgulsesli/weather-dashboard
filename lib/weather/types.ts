// OpenWeatherMap API TypeScript Interfaces
// Based on OpenWeatherMap API v2.5/3.0 response structure

// Coordinates
export interface Coordinates {
  lat: number;
  lon: number;
}

// Weather condition
export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

// Main weather data (current weather)
export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

// Wind data
export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

// Cloud data
export interface CloudData {
  all: number;
}

// Rain data (precipitation)
export interface RainData {
  '1h'?: number;
  '3h'?: number;
}

// Snow data
export interface SnowData {
  '1h'?: number;
  '3h'?: number;
}

// System data
export interface SystemData {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

// Current weather response
export interface CurrentWeatherResponse {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: WindData;
  clouds: CloudData;
  rain?: RainData;
  snow?: SnowData;
  dt: number;
  sys: SystemData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Forecast item (3-hour interval)
export interface ForecastItem {
  dt: number;
  main: MainWeatherData;
  weather: WeatherCondition[];
  clouds: CloudData;
  wind: WindData;
  visibility: number;
  pop: number; // Probability of precipitation
  rain?: RainData;
  snow?: SnowData;
  sys: { pod: string }; // Part of day (d/n)
  dt_txt: string;
}

// City data in forecast
export interface ForecastCity {
  id: number;
  name: string;
  coord: Coordinates;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

// 5-day forecast response
export interface ForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: ForecastCity;
}

// API Error response
export interface ApiErrorResponse {
  cod: string | number;
  message: string;
}

// Geocoding API response item
export interface GeocodingResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Air pollution data
export interface AirQualityComponent {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export interface AirQualityMain {
  aqi: number; // 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
}

export interface AirQualityItem {
  dt: number;
  main: AirQualityMain;
  components: AirQualityComponent;
}

export interface AirQualityResponse {
  coord: Coordinates;
  list: AirQualityItem[];
}

// API Client configuration
export interface WeatherApiConfig {
  apiKey: string;
  baseUrl?: string;
  units?: 'metric' | 'imperial' | 'standard';
  lang?: string;
  cacheTtlMs?: number;
}

// Cache entry structure
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// User-friendly error messages
export type WeatherErrorCode =
  | 'API_KEY_INVALID'
  | 'CITY_NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR'
  | 'CACHE_ERROR';

export interface WeatherError {
  code: WeatherErrorCode;
  message: string;
  originalError?: Error;
  statusCode?: number;
}
