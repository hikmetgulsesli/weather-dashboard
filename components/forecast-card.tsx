'use client';

import { ForecastData, TemperatureUnit } from '@/types/weather';
import { formatTemperature } from '@/lib/weather-utils';

import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  CloudLightning,
  CloudDrizzle,
  Droplets,
} from 'lucide-react';

interface ForecastCardProps {
  forecast: ForecastData;
  unit: TemperatureUnit;
}

function getWeatherIcon(condition: string, className: string = 'w-8 h-8') {
  switch (condition) {
    case 'clear':
      return <Sun className={className} />;
    case 'clouds':
      return <Cloud className={className} />;
    case 'rain':
      return <CloudRain className={className} />;
    case 'drizzle':
      return <CloudDrizzle className={className} />;
    case 'thunderstorm':
      return <CloudLightning className={className} />;
    case 'snow':
      return <CloudSnow className={className} />;
    case 'mist':
    case 'fog':
      return <Cloud className={className} />;
    default:
      return <Sun className={className} />;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Check if it's tomorrow
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function ForecastCard({ forecast, unit }: ForecastCardProps) {
  return (
    <div className="bg-white dark:bg-white/5 rounded-xl p-4 border border-border/50 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
      {/* Date */}
      <div className="text-center mb-3">
        <p className="text-sm font-medium text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          {formatDate(forecast.date)}
        </p>
      </div>

      {/* Weather Icon */}
      <div className="flex justify-center mb-3">
        <div className="text-primary">
          {getWeatherIcon(forecast.condition, 'w-10 h-10')}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-center text-muted-foreground capitalize mb-3 truncate">
        {forecast.description}
      </p>

      {/* High/Low Temps */}
      <div className="flex justify-center items-center gap-2 mb-3">
        <span className="text-lg font-bold text-foreground">
          {formatTemperature(forecast.maxTemp, unit)}
        </span>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-muted-foreground">
          {formatTemperature(forecast.minTemp, unit)}
        </span>
      </div>

      {/* Precipitation */}
      {forecast.precipitationChance > 0 && (
        <div className="flex items-center justify-center gap-1 text-xs text-blue-500">
          <Droplets className="w-3 h-3" />
          <span>{forecast.precipitationChance}%</span>
        </div>
      )}
    </div>
  );
}
