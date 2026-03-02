import {
  WeatherApiConfig,
  CurrentWeatherResponse,
  ForecastResponse,
  GeocodingResult,
  AirQualityResponse,
  ApiErrorResponse,
} from './types.js';
import { WeatherApiError, mapApiError, mapNetworkError } from './errors.js';
import { WeatherCache } from './cache.js';

// Default configuration
const DEFAULT_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const DEFAULT_GEO_URL = 'https://api.openweathermap.org/geo/1.0';
const DEFAULT_UNITS: 'metric' | 'imperial' | 'standard' = 'metric';
const DEFAULT_LANG = 'en';

export class WeatherApiClient {
  private apiKey: string;
  private baseUrl: string;
  private geoUrl: string;
  private units: 'metric' | 'imperial' | 'standard';
  private lang: string;
  private cache: WeatherCache;

  constructor(config: WeatherApiConfig) {
    if (!config.apiKey) {
      throw new WeatherApiError(
        'API_KEY_INVALID',
        'API key is required. Please provide a valid OpenWeatherMap API key.'
      );
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.geoUrl = DEFAULT_GEO_URL;
    this.units = config.units || DEFAULT_UNITS;
    this.lang = config.lang || DEFAULT_LANG;
    this.cache = new WeatherCache(config.cacheTtlMs);
  }

  // Make an API request with caching and error handling
  private async fetchWithCache<T>(
    endpoint: string,
    params: Record<string, string | number | undefined>,
    baseUrl: string = this.baseUrl
  ): Promise<T> {
    const cacheKey = this.cache.generateKey(endpoint, params);

    // Check cache first
    const cached = this.cache.get<T>(cacheKey);
    if (cached) {
      return cached;
    }

    // Build URL
    const url = new URL(`${baseUrl}/${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
    url.searchParams.append('appid', this.apiKey);
    url.searchParams.append('units', this.units);
    url.searchParams.append('lang', this.lang);

    try {
      const response = await fetch(url.toString());

      // Handle HTTP errors
      if (!response.ok) {
        let errorData: ApiErrorResponse | undefined;
        try {
          errorData = (await response.json()) as ApiErrorResponse;
        } catch {
          // If JSON parsing fails, use status text
        }
        throw mapApiError(
          response.status,
          errorData?.message || response.statusText
        );
      }

      const data = (await response.json()) as T;

      // Cache the successful response
      this.cache.set(cacheKey, data);

      return data;
    } catch (error) {
      // If it's already a WeatherApiError, re-throw it
      if (error instanceof WeatherApiError) {
        throw error;
      }

      // Otherwise, map it to a network error
      throw mapNetworkError(error as Error);
    }
  }

  /**
   * Get current weather data for a city
   * @param city - City name (e.g., "London")
   * @param stateCode - State code (optional, for US cities)
   * @param countryCode - ISO 3166-1 alpha-2 country code (optional)
   */
  async getCurrentWeather(
    city: string,
    stateCode?: string,
    countryCode?: string
  ): Promise<CurrentWeatherResponse> {
    const query = [city, stateCode, countryCode].filter(Boolean).join(',');

    return this.fetchWithCache<CurrentWeatherResponse>('weather', {
      q: query,
    });
  }

  /**
   * Get current weather by geographic coordinates
   * @param lat - Latitude
   * @param lon - Longitude
   */
  async getCurrentWeatherByCoords(
    lat: number,
    lon: number
  ): Promise<CurrentWeatherResponse> {
    return this.fetchWithCache<CurrentWeatherResponse>('weather', {
      lat,
      lon,
    });
  }

  /**
   * Get 5-day / 3-hour forecast for a city
   * @param city - City name
   * @param stateCode - State code (optional)
   * @param countryCode - ISO 3166-1 alpha-2 country code (optional)
   */
  async getForecast(
    city: string,
    stateCode?: string,
    countryCode?: string
  ): Promise<ForecastResponse> {
    const query = [city, stateCode, countryCode].filter(Boolean).join(',');

    return this.fetchWithCache<ForecastResponse>('forecast', {
      q: query,
    });
  }

  /**
   * Get 5-day forecast by geographic coordinates
   * @param lat - Latitude
   * @param lon - Longitude
   */
  async getForecastByCoords(
    lat: number,
    lon: number
  ): Promise<ForecastResponse> {
    return this.fetchWithCache<ForecastResponse>('forecast', {
      lat,
      lon,
    });
  }

  /**
   * Geocode a city name to coordinates
   * @param city - City name
   * @param stateCode - State code (optional)
   * @param countryCode - ISO 3166-1 alpha-2 country code (optional)
   * @param limit - Maximum number of results (default: 5)
   */
  async geocodeCity(
    city: string,
    stateCode?: string,
    countryCode?: string,
    limit: number = 5
  ): Promise<GeocodingResult[]> {
    const query = [city, stateCode, countryCode].filter(Boolean).join(',');

    return this.fetchWithCache<GeocodingResult[]>(
      'direct',
      {
        q: query,
        limit,
      },
      this.geoUrl
    );
  }

  /**
   * Reverse geocode coordinates to city name
   * @param lat - Latitude
   * @param lon - Longitude
   * @param limit - Maximum number of results (default: 5)
   */
  async reverseGeocode(
    lat: number,
    lon: number,
    limit: number = 5
  ): Promise<GeocodingResult[]> {
    return this.fetchWithCache<GeocodingResult[]>(
      'reverse',
      {
        lat,
        lon,
        limit,
      },
      this.geoUrl
    );
  }

  /**
   * Get air quality data for coordinates
   * @param lat - Latitude
   * @param lon - Longitude
   */
  async getAirQuality(lat: number, lon: number): Promise<AirQualityResponse> {
    return this.fetchWithCache<AirQualityResponse>(
      'air_pollution',
      {
        lat,
        lon,
      },
      'https://api.openweathermap.org/data/2.5'
    );
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return this.cache.getStats();
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Factory function to create a client with environment variable API key
export function createWeatherClient(
  apiKey?: string,
  options?: Omit<WeatherApiConfig, 'apiKey'>
): WeatherApiClient {
  const key = apiKey || process.env.OPENWEATHER_API_KEY;

  if (!key) {
    throw new WeatherApiError(
      'API_KEY_INVALID',
      'API key is required. Set OPENWEATHER_API_KEY environment variable or pass apiKey parameter.'
    );
  }

  return new WeatherApiClient({
    apiKey: key,
    ...options,
  });
}
