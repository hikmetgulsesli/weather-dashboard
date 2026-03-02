'use client';

import { useState, useEffect } from 'react';
import { WeatherData, TemperatureUnit } from '@/types/weather';
import { fetchCurrentWeather } from '@/lib/weather-api';
import { WeatherCard } from '@/components/weather-card';
import { WeatherCardSkeleton } from '@/components/weather-skeleton';
import { ErrorState } from '@/components/error-state';
import { UnitToggle } from '@/components/unit-toggle';
import { CloudSun } from 'lucide-react';

const DEFAULT_CITY = 'London';

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('celsius');

  const loadWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchCurrentWeather(DEFAULT_CITY);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

  const handleUnitToggle = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <CloudSun className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 
              className="text-2xl sm:text-3xl font-bold text-foreground"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Weather Dashboard
            </h1>
          </div>
          
          <UnitToggle unit={unit} onToggle={handleUnitToggle} />
        </header>

        {/* Main Content */}
        <main>
          {loading && <WeatherCardSkeleton />}
          
          {error && !loading && (
            <ErrorState 
              message={error} 
              onRetry={loadWeather}
            />
          )}
          
          {weather && !loading && !error && (
            <WeatherCard 
              weather={weather} 
              unit={unit}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Weather data provided by OpenWeatherMap
          </p>
        </footer>
      </div>
    </div>
  );
}
