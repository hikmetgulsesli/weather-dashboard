import { TemperatureUnit } from '@/types/weather';

export function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return Math.round(((fahrenheit - 32) * 5) / 9);
}

export function formatTemperature(
  temp: number, 
  unit: TemperatureUnit
): string {
  const value = unit === 'fahrenheit' ? celsiusToFahrenheit(temp) : Math.round(temp);
  return `${value}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function formatWindSpeed(speed: number, unit: TemperatureUnit): string {
  // OpenWeatherMap returns wind speed in m/s
  // Convert to km/h or mph
  if (unit === 'fahrenheit') {
    const mph = Math.round(speed * 2.237);
    return `${mph} mph`;
  }
  const kmh = Math.round(speed * 3.6);
  return `${kmh} km/h`;
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}
