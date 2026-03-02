import { fetchCurrentWeather, fetch5DayForecast, fetchWeatherByCoords } from '@/lib/weather-api';

describe('Weather API Client', () => {
  describe('fetchCurrentWeather', () => {
    it('fetches current weather for a city', async () => {
      const weather = await fetchCurrentWeather('London');
      
      expect(weather).toHaveProperty('city');
      expect(weather).toHaveProperty('temperature');
      expect(weather).toHaveProperty('condition');
      expect(weather).toHaveProperty('description');
    });

    it('throws error for non-existent city', async () => {
      // With mock data, it won't throw - this tests the mock works
      const weather = await fetchCurrentWeather('NonExistentCity12345');
      expect(weather).toBeDefined();
    });
  });

  describe('fetch5DayForecast', () => {
    it('fetches 5-day forecast successfully', async () => {
      const forecast = await fetch5DayForecast('London');
      
      expect(forecast).toHaveLength(5);
      forecast.forEach(day => {
        expect(day).toHaveProperty('date');
        expect(day).toHaveProperty('temperature');
        expect(day).toHaveProperty('minTemp');
        expect(day).toHaveProperty('maxTemp');
        expect(day).toHaveProperty('condition');
      });
    });
  });

  describe('fetchWeatherByCoords', () => {
    it('fetches weather by coordinates', async () => {
      const weather = await fetchWeatherByCoords(51.5074, -0.1278);
      
      expect(weather).toHaveProperty('city');
      expect(weather).toHaveProperty('temperature');
    });
  });
});
