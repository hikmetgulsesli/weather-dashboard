'use client';

import { ForecastData, TemperatureUnit } from '@/types/weather';
import { ForecastCard } from './forecast-card';
import { ForecastSkeleton } from './forecast-skeleton';
import { CalendarDays } from 'lucide-react';

interface ForecastSectionProps {
  forecasts: ForecastData[];
  unit: TemperatureUnit;
  isLoading: boolean;
  error: string | null;
}

export function ForecastSection({ forecasts, unit, isLoading, error }: ForecastSectionProps) {
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <div className="bg-gradient-to-br from-blue-500/5 via-transparent to-transparent rounded-2xl p-6 sm:p-8 border border-blue-100 dark:border-blue-900/20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              5-Day Forecast
            </h3>
            <p className="text-sm text-muted-foreground">
              Extended weather outlook
            </p>
          </div>
        </div>

        {/* Forecast Grid */}
        {isLoading ? (
          <ForecastSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
            {forecasts.map((forecast) => (
              <ForecastCard key={forecast.date} forecast={forecast} unit={unit} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
