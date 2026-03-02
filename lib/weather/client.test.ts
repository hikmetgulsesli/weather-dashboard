import { WeatherApiClient, createWeatherClient } from './client.js';
import { WeatherApiError } from './errors.js';
import {
  CurrentWeatherResponse,
  ForecastResponse,
  GeocodingResult,
  AirQualityResponse,
} from './types.js';

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('WeatherApiClient', () => {
  const mockApiKey = 'test-api-key';
  let client: WeatherApiClient;

  beforeEach(() => {
    client = new WeatherApiClient({ apiKey: mockApiKey });
    mockFetch.mockClear();
    client.clearCache();
  });

  describe('constructor', () => {
    it('should create client with valid API key', () => {
      const c = new WeatherApiClient({ apiKey: 'valid-key' });
      expect(c).toBeInstanceOf(WeatherApiClient);
    });

    it('should throw error when API key is empty', () => {
      expect(() => new WeatherApiClient({ apiKey: '' })).toThrow(WeatherApiError);
    });

    it('should throw error when API key is undefined', () => {
      expect(() => new WeatherApiClient({ apiKey: undefined as unknown as string })).toThrow(
        WeatherApiError
      );
    });

    it('should use custom configuration options', () => {
      const c = new WeatherApiClient({
        apiKey: mockApiKey,
        units: 'imperial',
        lang: 'es',
        cacheTtlMs: 10000,
      });
      expect(c).toBeInstanceOf(WeatherApiClient);
    });
  });

  describe('getCurrentWeather', () => {
    const mockCurrentWeather: CurrentWeatherResponse = {
      coord: { lon: -0.1257, lat: 51.5085 },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      base: 'stations',
      main: {
        temp: 20.5,
        feels_like: 19.8,
        temp_min: 18.2,
        temp_max: 22.1,
        pressure: 1015,
        humidity: 65,
      },
      visibility: 10000,
      wind: { speed: 3.5, deg: 250 },
      clouds: { all: 0 },
      dt: 1625580000,
      sys: {
        type: 2,
        id: 2019646,
        country: 'GB',
        sunrise: 1625520000,
        sunset: 1625577600,
      },
      timezone: 3600,
      id: 2643743,
      name: 'London',
      cod: 200,
    };

    it('should fetch current weather for a city', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCurrentWeather,
      } as Response);

      const result = await client.getCurrentWeather('London');

      expect(result).toEqual(mockCurrentWeather);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q=London')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('appid=test-api-key')
      );
    });

    it('should fetch current weather with state and country codes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCurrentWeather,
      } as Response);

      await client.getCurrentWeather('Springfield', 'IL', 'US');

      // URL encoded commas
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('Springfield')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('IL')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('US')
      );
    });

    it('should return cached data on second call', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCurrentWeather,
      } as Response);

      await client.getCurrentWeather('London');
      const result2 = await client.getCurrentWeather('London');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result2).toEqual(mockCurrentWeather);
    });

    it('should throw WeatherApiError on 401 (invalid API key)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ cod: 401, message: 'Invalid API key' }),
      } as Response);

      await expect(client.getCurrentWeather('London')).rejects.toThrow(
        WeatherApiError
      );
    });

    it('should throw WeatherApiError with correct code on 401', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ cod: 401, message: 'Invalid API key' }),
      } as Response);

      try {
        await client.getCurrentWeather('London');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(WeatherApiError);
        expect((error as WeatherApiError).code).toBe('API_KEY_INVALID');
        expect((error as WeatherApiError).message).toContain('Invalid API key');
      }
    });

    it('should throw WeatherApiError on 404 (city not found)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ cod: 404, message: 'city not found' }),
      } as Response);

      try {
        await client.getCurrentWeather('NonExistentCity12345');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(WeatherApiError);
        expect((error as WeatherApiError).code).toBe('CITY_NOT_FOUND');
      }
    });

    it('should throw WeatherApiError on 429 (rate limit)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: async () => ({ cod: 429, message: 'rate limit exceeded' }),
      } as Response);

      try {
        await client.getCurrentWeather('London');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(WeatherApiError);
        expect((error as WeatherApiError).code).toBe('RATE_LIMIT_EXCEEDED');
      }
    });

    it('should throw WeatherApiError on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('fetch failed'));

      try {
        await client.getCurrentWeather('London');
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(WeatherApiError);
        expect((error as WeatherApiError).code).toBe('NETWORK_ERROR');
      }
    });
  });

  describe('getCurrentWeatherByCoords', () => {
    const mockCurrentWeather: CurrentWeatherResponse = {
      coord: { lon: -0.1257, lat: 51.5085 },
      weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
      base: 'stations',
      main: { temp: 20.5, feels_like: 19.8, temp_min: 18.2, temp_max: 22.1, pressure: 1015, humidity: 65 },
      visibility: 10000,
      wind: { speed: 3.5, deg: 250 },
      clouds: { all: 0 },
      dt: 1625580000,
      sys: { country: 'GB', sunrise: 1625520000, sunset: 1625577600 },
      timezone: 3600,
      id: 2643743,
      name: 'London',
      cod: 200,
    };

    it('should fetch current weather by coordinates', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCurrentWeather,
      } as Response);

      const result = await client.getCurrentWeatherByCoords(51.5085, -0.1257);

      expect(result).toEqual(mockCurrentWeather);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('lat=51.5085')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('lon=-0.1257')
      );
    });
  });

  describe('getForecast', () => {
    const mockForecast: ForecastResponse = {
      cod: '200',
      message: 0,
      cnt: 40,
      list: [
        {
          dt: 1625580000,
          main: {
            temp: 20.5,
            feels_like: 19.8,
            temp_min: 18.2,
            temp_max: 22.1,
            pressure: 1015,
            humidity: 65,
          },
          weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }],
          clouds: { all: 0 },
          wind: { speed: 3.5, deg: 250 },
          visibility: 10000,
          pop: 0,
          sys: { pod: 'd' },
          dt_txt: '2021-07-06 12:00:00',
        },
      ],
      city: {
        id: 2643743,
        name: 'London',
        coord: { lat: 51.5085, lon: -0.1257 },
        country: 'GB',
        population: 1000000,
        timezone: 3600,
        sunrise: 1625520000,
        sunset: 1625577600,
      },
    };

    it('should fetch 5-day forecast for a city', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockForecast,
      } as Response);

      const result = await client.getForecast('London');

      expect(result).toEqual(mockForecast);
      expect(result.list).toHaveLength(1);
      expect(result.city.name).toBe('London');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/forecast')
      );
    });

    it('should fetch forecast by coordinates', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockForecast,
      } as Response);

      const result = await client.getForecastByCoords(51.5085, -0.1257);

      expect(result).toEqual(mockForecast);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('lat=51.5085')
      );
    });

    it('should return cached forecast data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockForecast,
      } as Response);

      await client.getForecast('London');
      const result2 = await client.getForecast('London');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result2).toEqual(mockForecast);
    });
  });

  describe('geocodeCity', () => {
    const mockGeocodingResults: GeocodingResult[] = [
      {
        name: 'London',
        local_names: { en: 'London', ru: 'Лондон' },
        lat: 51.5073219,
        lon: -0.1276474,
        country: 'GB',
        state: 'England',
      },
      {
        name: 'London',
        lat: 42.9832406,
        lon: -81.243372,
        country: 'CA',
        state: 'Ontario',
      },
    ];

    it('should geocode a city name to coordinates', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeocodingResults,
      } as Response);

      const results = await client.geocodeCity('London');

      expect(results).toEqual(mockGeocodingResults);
      expect(results).toHaveLength(2);
      expect(results[0].country).toBe('GB');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('geo/1.0/direct')
      );
    });

    it('should respect the limit parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGeocodingResults.slice(0, 1),
      } as Response);

      await client.geocodeCity('London', undefined, undefined, 1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=1')
      );
    });

    it('should return empty array when no results found', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

      const results = await client.geocodeCity('NonExistentCity12345');

      expect(results).toEqual([]);
    });
  });

  describe('reverseGeocode', () => {
    const mockReverseGeocodeResults: GeocodingResult[] = [
      {
        name: 'City of London',
        local_names: { en: 'City of London' },
        lat: 51.5156177,
        lon: -0.0919983,
        country: 'GB',
        state: 'England',
      },
    ];

    it('should reverse geocode coordinates to city name', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockReverseGeocodeResults,
      } as Response);

      const results = await client.reverseGeocode(51.5156, -0.092);

      expect(results).toEqual(mockReverseGeocodeResults);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('geo/1.0/reverse')
      );
    });
  });

  describe('getAirQuality', () => {
    const mockAirQuality: AirQualityResponse = {
      coord: { lat: 51.5085, lon: -0.1257 },
      list: [
        {
          dt: 1625580000,
          main: { aqi: 2 },
          components: {
            co: 220.5,
            no: 0.5,
            no2: 12.3,
            o3: 68.2,
            so2: 1.2,
            pm2_5: 8.5,
            pm10: 15.2,
            nh3: 0.8,
          },
        },
      ],
    };

    it('should fetch air quality data for coordinates', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAirQuality,
      } as Response);

      const result = await client.getAirQuality(51.5085, -0.1257);

      expect(result).toEqual(mockAirQuality);
      expect(result.list[0].main.aqi).toBe(2);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('air_pollution')
      );
    });
  });

  describe('cache management', () => {
    it('should clear cache when clearCache is called', async () => {
      const mockResponse: CurrentWeatherResponse = {
        coord: { lat: 51.5, lon: -0.1 },
        weather: [],
        base: 'stations',
        main: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22, pressure: 1015, humidity: 65 },
        visibility: 10000,
        wind: { speed: 3, deg: 200 },
        clouds: { all: 0 },
        dt: 1625580000,
        sys: { country: 'GB', sunrise: 1625520000, sunset: 1625577600 },
        timezone: 3600,
        id: 123,
        name: 'Test',
        cod: 200,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await client.getCurrentWeather('Test');
      expect(client.getCacheStats().size).toBe(1);

      client.clearCache();
      expect(client.getCacheStats().size).toBe(0);
    });

    it('should return cache statistics', async () => {
      const mockResponse: CurrentWeatherResponse = {
        coord: { lat: 51.5, lon: -0.1 },
        weather: [],
        base: 'stations',
        main: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22, pressure: 1015, humidity: 65 },
        visibility: 10000,
        wind: { speed: 3, deg: 200 },
        clouds: { all: 0 },
        dt: 1625580000,
        sys: { country: 'GB', sunrise: 1625520000, sunset: 1625577600 },
        timezone: 3600,
        id: 123,
        name: 'TestCity',
        cod: 200,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await client.getCurrentWeather('TestCity');
      const stats = client.getCacheStats();

      expect(stats.size).toBe(1);
      expect(stats.keys.length).toBe(1);
      expect(stats.keys[0]).toContain('TestCity');
    });
  });
});

describe('createWeatherClient', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.OPENWEATHER_API_KEY;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should create client with provided API key', () => {
    const client = createWeatherClient('my-api-key');
    expect(client).toBeInstanceOf(WeatherApiClient);
  });

  it('should create client with environment variable', () => {
    process.env.OPENWEATHER_API_KEY = 'env-api-key';
    const client = createWeatherClient();
    expect(client).toBeInstanceOf(WeatherApiClient);
  });

  it('should throw error when no API key is available', () => {
    expect(() => createWeatherClient()).toThrow(WeatherApiError);
  });

  it('should pass additional options to client', () => {
    const client = createWeatherClient('key', {
      units: 'imperial',
      lang: 'de',
      cacheTtlMs: 60000,
    });
    expect(client).toBeInstanceOf(WeatherApiClient);
  });
});
