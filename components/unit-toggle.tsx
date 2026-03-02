'use client';

import { TemperatureUnit } from '@/types/weather';
import { cn } from '@/lib/utils';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onToggle: (unit: TemperatureUnit) => void;
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <div className="inline-flex items-center bg-muted rounded-lg p-1 border border-border">
      <button
        onClick={() => onToggle('celsius')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer',
          unit === 'celsius'
            ? 'bg-white dark:bg-slate-800 text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={unit === 'celsius'}
        aria-label="Switch to Celsius"
      >
        °C
      </button>
      <button
        onClick={() => onToggle('fahrenheit')}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 cursor-pointer',
          unit === 'fahrenheit'
            ? 'bg-white dark:bg-slate-800 text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-pressed={unit === 'fahrenheit'}
        aria-label="Switch to Fahrenheit"
      >
        °F
      </button>
    </div>
  );
}
