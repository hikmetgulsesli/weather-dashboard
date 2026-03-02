import { ForecastApiResponse } from '@/types/weather';

// Mock fetch globally
global.fetch = jest.fn();

describe('Forecast API', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('fetchForecast', () => {
    it('returns mock data when no API key is provided', async () => {
      process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = '';
      
      // Re-import module to get fresh instance with new env
      const { fetchForecast } = await import('@/lib/weather-api');
      
      const result = await fetchForecast('London');
      
      expect(result).toHaveLength(5);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('minTemp');
      expect(result[0]).toHaveProperty('maxTemp');
      expect(result[0]).toHaveProperty('precipitationChance');
    });

    it('fetches and groups forecast data by day', async () => {
      process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test-key';
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);
      
      const mockResponse: ForecastApiResponse = {
        list: [
          // Day 1 - Tomorrow
          {
            dt: Math.floor(new Date(tomorrow).setHours(9, 0, 0, 0) / 1000),
            main: { temp: 15, temp_min: 12, temp_max: 18, humidity: 65 },
            weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
            wind: { speed: 4.2 },
            pop: 0,
          },
          {
            dt: Math.floor(new Date(tomorrow).setHours(15, 0, 0, 0) / 1000),
            main: { temp: 18, temp_min: 12, temp_max: 20, humidity: 60 },
            weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
            wind: { speed: 4.5 },
            pop: 0,
          },
          // Day 2
          {
            dt: Math.floor(new Date(dayAfter).setHours(9, 0, 0, 0) / 1000),
            main: { temp: 14, temp_min: 10, temp_max: 17, humidity: 70 },
            weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
            wind: { speed: 5.0 },
            pop: 0.2,
          },
        ],
        city: { name: 'London', country: 'GB' },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { fetchForecast } = await import('@/lib/weather-api');
      const result = await fetchForecast('London');
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('minTemp');
      expect(result[0]).toHaveProperty('maxTemp');
      expect(result[0]).toHaveProperty('precipitationChance');
    });

    it('throws error for 404 response', async () => {
      process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test-key';
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { fetchForecast } = await import('@/lib/weather-api');
      await expect(fetchForecast('InvalidCity')).rejects.toThrow('not found');
    });

    it('throws error for other failed responses', async () => {
      process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test-key';
      
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const { fetchForecast } = await import('@/lib/weather-api');
      await expect(fetchForecast('London')).rejects.toThrow('Failed to fetch forecast');
    });
  });

  describe('fetchForecastByCoords', () => {
    it('returns mock data when no API key is provided', async () => {
      process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = '';
      
      const { fetchForecastByCoords } = await import('@/lib/weather-api');
      const result = await fetchForecastByCoords(51.5074, -0.1278);
      
      expect(result).toHaveLength(5);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('condition');
    });

    it('fetches forecast by coordinates', async () => {
      process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY = 'test-key';
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const day3 = new Date();
      day3.setDate(day3.getDate() + 2);
      
      const mockResponse: ForecastApiResponse = {
        list: [
          // Tomorrow
          {
            dt: Math.floor(new Date(tomorrow).setHours(9, 0, 0, 0) / 1000),
            main: { temp: 16, temp_min: 11, temp_max: 19, humidity: 68 },
            weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
            wind: { speed: 5.5 },
            pop: 0.7,
          },
          // Day 3
          {
            dt: Math.floor(new Date(day3).setHours(12, 0, 0, 0) / 1000),
            main: { temp: 18, temp_min: 12, temp_max: 21, humidity: 65 },
            weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
            wind: { speed: 4.0 },
            pop: 0,
          },
        ],
        city: { name: 'London', country: 'GB' },
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { fetchForecastByCoords } = await import('@/lib/weather-api');
      const result = await fetchForecastByCoords(51.5074, -0.1278);
      
      expect(result.length).toBeGreaterThan(0);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('lat=51.5074')
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('lon=-0.1278')
      );
    });
  });
});
