import { render, screen } from '@testing-library/react';
import { ForecastCard } from '@/components/forecast-card';
import { ForecastData } from '@/types/weather';

const createMockForecast = (dateOffset: number): ForecastData => ({
  date: new Date(Date.now() + dateOffset * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  temperature: 18,
  minTemp: 12,
  maxTemp: 22,
  condition: 'clear',
  description: 'clear sky',
  icon: '01d',
  humidity: 65,
  windSpeed: 4.2,
  precipitationChance: 0,
});

describe('ForecastCard', () => {
  it('renders forecast date correctly', () => {
    const mockForecast = createMockForecast(2); // Day after tomorrow
    render(<ForecastCard forecast={mockForecast} unit="celsius" />);
    
    // Should show formatted date with weekday
    const dateElement = screen.getByText(/^(tomorrow|[a-z]+,)/i);
    expect(dateElement).toBeInTheDocument();
  });

  it('renders weather description', () => {
    const mockForecast = createMockForecast(2);
    render(<ForecastCard forecast={mockForecast} unit="celsius" />);
    
    expect(screen.getByText('clear sky')).toBeInTheDocument();
  });

  it('displays high and low temperatures in celsius', () => {
    const mockForecast = createMockForecast(2);
    render(<ForecastCard forecast={mockForecast} unit="celsius" />);
    
    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByText('12°C')).toBeInTheDocument();
  });

  it('displays high and low temperatures in fahrenheit', () => {
    const mockForecast = createMockForecast(2);
    render(<ForecastCard forecast={mockForecast} unit="fahrenheit" />);
    
    // 22°C = 72°F, 12°C = 54°F
    expect(screen.getByText('72°F')).toBeInTheDocument();
    expect(screen.getByText('54°F')).toBeInTheDocument();
  });

  it('shows precipitation chance when available', () => {
    const forecastWithRain: ForecastData = {
      ...createMockForecast(2),
      precipitationChance: 70,
    };
    
    render(<ForecastCard forecast={forecastWithRain} unit="celsius" />);
    
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('does not show precipitation when chance is 0', () => {
    const mockForecast = createMockForecast(2);
    render(<ForecastCard forecast={mockForecast} unit="celsius" />);
    
    expect(screen.queryByText('0%')).not.toBeInTheDocument();
  });

  it('renders different weather conditions with correct icons', () => {
    const conditions: Array<{ condition: ForecastData['condition']; description: string }> = [
      { condition: 'clear', description: 'sunny' },
      { condition: 'clouds', description: 'cloudy' },
      { condition: 'rain', description: 'rainy' },
      { condition: 'snow', description: 'snowy' },
      { condition: 'thunderstorm', description: 'stormy' },
    ];

    conditions.forEach(({ condition, description }) => {
      const { container } = render(
        <ForecastCard 
          forecast={{ ...createMockForecast(2), condition, description }} 
          unit="celsius" 
        />
      );
      
      expect(screen.getByText(description)).toBeInTheDocument();
      // Check that an SVG icon is rendered
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('shows "Tomorrow" for the next day', () => {
    const tomorrow = createMockForecast(1);
    
    render(
      <ForecastCard 
        forecast={tomorrow} 
        unit="celsius" 
      />
    );
    
    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
  });
});
