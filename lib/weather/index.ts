// Weather API Client - Main exports
export {
  WeatherApiClient,
  createWeatherClient,
} from './client.js';

export {
  WeatherApiError,
  mapApiError,
  mapNetworkError,
} from './errors.js';

export {
  WeatherCache,
  getGlobalCache,
  clearGlobalCache,
} from './cache.js';

export type {
  // Core types
  Coordinates,
  WeatherCondition,
  MainWeatherData,
  WindData,
  CloudData,
  RainData,
  SnowData,
  SystemData,
  
  // Response types
  CurrentWeatherResponse,
  ForecastResponse,
  ForecastItem,
  ForecastCity,
  ApiErrorResponse,
  
  // Geocoding
  GeocodingResult,
  
  // Air quality
  AirQualityResponse,
  AirQualityComponent,
  AirQualityMain,
  AirQualityItem,
  
  // Configuration
  WeatherApiConfig,
  CacheEntry,
  WeatherError,
  WeatherErrorCode,
} from './types.js';
