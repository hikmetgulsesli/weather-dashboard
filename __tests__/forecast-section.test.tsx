import { render, screen } from '@testing-library/react';
import { ForecastSection } from '@/components/forecast-section';
import { ForecastData } from '@/types/weather';

const mockForecasts: ForecastData[] = [
  {
    date: '2026-03-03',
    temperature: 18,
    minTemp: 12,
    maxTemp: 22,
    condition: 'clear',
    description: 'clear sky',
    icon: '01d',
    humidity: 65,
    windSpeed: 4.2,
    precipitationChance: 0,
  },
  {
    date: '2026-03-04',
    temperature: 16,
    minTemp: 10,
    maxTemp: 20,
    condition: 'clouds',
    description: 'scattered clouds',
    icon: '03d',
    humidity: 70,
    windSpeed: 5.1,
    precipitationChance: 20,
  },
  {
    date: '2026-03-05',
    temperature: 14,
    minTemp: 9,
    maxTemp: 18,
    condition: 'rain',
    description: 'light rain',
    icon: '10d',
    humidity: 80,
    windSpeed: 6.0,
    precipitationChance: 80,
  },
  {
    date: '2026-03-06',
    temperature: 15,
    minTemp: 8,
    maxTemp: 19,
    condition: 'clouds',
    description: 'broken clouds',
    icon: '04d',
    humidity: 75,
    windSpeed: 4.5,
    precipitationChance: 10,
  },
  {
    date: '2026-03-07',
    temperature: 17,
    minTemp: 11,
    maxTemp: 21,
    condition: 'clear',
    description: 'few clouds',
    icon: '02d',
    humidity: 60,
    windSpeed: 3.8,
    precipitationChance: 0,
  },
];

describe('ForecastSection', () => {
  it('renders section header correctly', () => {
    render(
      <ForecastSection 
        forecasts={mockForecasts} 
        unit="celsius" 
        isLoading={false}
        error={null}
      />
    );
    
    expect(screen.getByText('5-Day Forecast')).toBeInTheDocument();
    expect(screen.getByText('Extended weather outlook')).toBeInTheDocument();
  });

  it('renders all 5 forecast cards', () => {
    render(
      <ForecastSection 
        forecasts={mockForecasts} 
        unit="celsius" 
        isLoading={false}
        error={null}
      />
    );
    
    // Should render 5 forecast cards with descriptions
    expect(screen.getByText('clear sky')).toBeInTheDocument();
    expect(screen.getByText('scattered clouds')).toBeInTheDocument();
    expect(screen.getByText('light rain')).toBeInTheDocument();
    expect(screen.getByText('broken clouds')).toBeInTheDocument();
    expect(screen.getByText('few clouds')).toBeInTheDocument();
  });

  it('shows loading skeleton when isLoading is true', () => {
    render(
      <ForecastSection 
        forecasts={[]} 
        unit="celsius" 
        isLoading={true}
        error={null}
      />
    );
    
    // Should show skeleton elements (animate-pulse class)
    const skeletonElements = document.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('displays error message when error is provided', () => {
    render(
      <ForecastSection 
        forecasts={[]} 
        unit="celsius" 
        isLoading={false}
        error="Failed to load forecast"
      />
    );
    
    expect(screen.getByText('Failed to load forecast')).toBeInTheDocument();
  });

  it('renders precipitation chances correctly', () => {
    render(
      <ForecastSection 
        forecasts={mockForecasts} 
        unit="celsius" 
        isLoading={false}
        error={null}
      />
    );
    
    // Check for precipitation percentages
    expect(screen.getByText('20%')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('10%')).toBeInTheDocument();
  });
});
