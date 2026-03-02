import { 
  celsiusToFahrenheit, 
  fahrenheitToCelsius, 
  formatTemperature,
  formatWindSpeed,
  getWeatherIconUrl 
} from '@/lib/weather-utils';

describe('weather-utils', () => {
  describe('celsiusToFahrenheit', () => {
    it('converts 0°C to 32°F', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
    });

    it('converts 100°C to 212°F', () => {
      expect(celsiusToFahrenheit(100)).toBe(212);
    });

    it('converts negative temperatures correctly', () => {
      expect(celsiusToFahrenheit(-10)).toBe(14);
    });

    it('rounds to nearest integer', () => {
      expect(celsiusToFahrenheit(18.7)).toBe(66);
    });
  });

  describe('fahrenheitToCelsius', () => {
    it('converts 32°F to 0°C', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
    });

    it('converts 212°F to 100°C', () => {
      expect(fahrenheitToCelsius(212)).toBe(100);
    });

    it('rounds to nearest integer', () => {
      expect(fahrenheitToCelsius(68)).toBe(20);
    });
  });

  describe('formatTemperature', () => {
    it('formats celsius correctly', () => {
      expect(formatTemperature(20, 'celsius')).toBe('20°C');
    });

    it('formats fahrenheit correctly', () => {
      expect(formatTemperature(20, 'fahrenheit')).toBe('68°F');
    });

    it('rounds decimal temperatures', () => {
      expect(formatTemperature(20.7, 'celsius')).toBe('21°C');
    });
  });

  describe('formatWindSpeed', () => {
    it('converts m/s to km/h for celsius', () => {
      // 5 m/s * 3.6 = 18 km/h
      expect(formatWindSpeed(5, 'celsius')).toBe('18 km/h');
    });

    it('converts m/s to mph for fahrenheit', () => {
      // 5 m/s * 2.237 = 11.185 ≈ 11 mph
      expect(formatWindSpeed(5, 'fahrenheit')).toBe('11 mph');
    });

    it('rounds to nearest integer', () => {
      expect(formatWindSpeed(5.7, 'celsius')).toBe('21 km/h');
    });
  });

  describe('getWeatherIconUrl', () => {
    it('returns correct URL for icon code', () => {
      expect(getWeatherIconUrl('01d')).toBe('https://openweathermap.org/img/wn/01d@2x.png');
    });

    it('handles night icons', () => {
      expect(getWeatherIconUrl('02n')).toBe('https://openweathermap.org/img/wn/02n@2x.png');
    });
  });
});
