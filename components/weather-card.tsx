'use client';

import { WeatherData, TemperatureUnit } from '@/types/weather';
import { formatTemperature, formatWindSpeed, getWeatherIconUrl } from '@/lib/weather-utils';
import Image from 'next/image';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  CloudSnow, 
  CloudLightning,
  CloudDrizzle,
  Wind,
  Droplets,
  Thermometer
} from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
  unit: TemperatureUnit;
}

function getWeatherIcon(condition: string, className: string = 'w-16 h-16') {
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

export function WeatherCard({ weather, unit }: WeatherCardProps) {
  const formattedDate = new Date(weather.timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = new Date(weather.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent rounded-2xl p-6 sm:p-8 border border-blue-100 dark:border-blue-900/30">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              {weather.city}, {weather.country}
            </h2>
            <p className="text-muted-foreground mt-1">
              {formattedDate}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              Last updated: {formattedTime}
            </p>
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-primary">
              {getWeatherIcon(weather.condition, 'w-20 h-20 sm:w-24 sm:h-24')}
            </div>
            <div className="text-center sm:text-left">
              <div className="text-5xl sm:text-6xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                {formatTemperature(weather.temperature, unit)}
              </div>
              <p className="text-lg text-muted-foreground capitalize mt-1">
                {weather.description}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Feels Like */}
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Feels Like</span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {formatTemperature(weather.feelsLike, unit)}
            </p>
          </div>

          {/* Humidity */}
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Humidity</span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {weather.humidity}%
            </p>
          </div>

          {/* Wind Speed */}
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Wind</span>
            </div>
            <p className="text-xl font-semibold text-foreground">
              {formatWindSpeed(weather.windSpeed, unit)}
            </p>
          </div>

          {/* Weather Icon from API */}
          <div className="bg-white/50 dark:bg-white/5 rounded-xl p-4 border border-border/50 flex flex-col items-center justify-center">
            <Image 
              src={getWeatherIconUrl(weather.icon)} 
              alt={weather.description}
              width={48}
              height={48}
              className="w-12 h-12"
              loading="lazy"
            />
            <span className="text-xs text-muted-foreground mt-1 capitalize">
              {weather.condition}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
