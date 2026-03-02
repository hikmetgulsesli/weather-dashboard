import { render, screen } from '@testing-library/react';
import { WeatherCard } from '@/components/weather-card';
import { WeatherData } from '@/types/weather';

const mockWeather: WeatherData = {
  city: 'London',
  country: 'GB',
  temperature: 18,
  feelsLike: 16,
  humidity: 65,
  windSpeed: 4.2,
  condition: 'clouds',
  description: 'scattered clouds',
  icon: '03d',
  timestamp: 1704067200000, // 2024-01-01 00:00:00
};

describe('WeatherCard', () => {
  it('renders city and country', () => {
    render(<WeatherCard weather={mockWeather} unit="celsius" />);
    
    expect(screen.getByText('London, GB')).toBeInTheDocument();
  });

  it('renders temperature in celsius', () => {
    render(<WeatherCard weather={mockWeather} unit="celsius" />);
    
    expect(screen.getByText('18°C')).toBeInTheDocument();
  });

  it('renders temperature in fahrenheit', () => {
    render(<WeatherCard weather={mockWeather} unit="fahrenheit" />);
    
    // 18°C = 64.4°F ≈ 64°F
    expect(screen.getByText('64°F')).toBeInTheDocument();
  });

  it('renders weather description', () => {
    render(<WeatherCard weather={mockWeather} unit="celsius" />);
    
    expect(screen.getByText('scattered clouds')).toBeInTheDocument();
  });

  it('renders humidity', () => {
    render(<WeatherCard weather={mockWeather} unit="celsius" />);
    
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('Humidity')).toBeInTheDocument();
  });

  it('renders wind speed in km/h for celsius', () => {
    render(<WeatherCard weather={mockWeather} unit="celsius" />);
    
    // 4.2 m/s * 3.6 = 15.12 ≈ 15 km/h
    expect(screen.getByText('15 km/h')).toBeInTheDocument();
    expect(screen.getByText('Wind')).toBeInTheDocument();
  });

  it('renders wind speed in mph for fahrenheit', () => {
    render(<WeatherCard weather={mockWeather} unit="fahrenheit" />);
    
    // 4.2 m/s * 2.237 = 9.3954 ≈ 9 mph
    expect(screen.getByText('9 mph')).toBeInTheDocument();
  });

  it('renders feels like temperature', () => {
    render(<WeatherCard weather={mockWeather} unit="celsius" />);
    
    expect(screen.getByText('16°C')).toBeInTheDocument();
    expect(screen.getByText('Feels Like')).toBeInTheDocument();
  });

  it('renders weather icon image', () => {
    render(<WeatherCard weather={mockWeather} unit="celsius" />);
    
    const iconImage = screen.getByAltText('scattered clouds');
    expect(iconImage).toBeInTheDocument();
    // Next.js Image component transforms the src, so we just check it contains the URL
    expect(iconImage.getAttribute('src')).toContain('openweathermap.org');
  });

  it('renders date and time', () => {
    render(<WeatherCard weather={mockWeather} unit="celsius" />);
    
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it('renders different weather conditions', () => {
    const sunnyWeather = { ...mockWeather, condition: 'clear' as const, description: 'clear sky' };
    render(<WeatherCard weather={sunnyWeather} unit="celsius" />);
    
    expect(screen.getByText('clear sky')).toBeInTheDocument();
  });
});
