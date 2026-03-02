import { WeatherError, WeatherErrorCode } from './types.js';

// Custom error class for weather API errors
export class WeatherApiError extends Error {
  public code: WeatherErrorCode;
  public statusCode?: number;
  public originalError?: Error;

  constructor(
    code: WeatherErrorCode,
    message: string,
    statusCode?: number,
    originalError?: Error
  ) {
    super(message);
    this.name = 'WeatherApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.originalError = originalError;
  }

  toJSON(): WeatherError {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      originalError: this.originalError,
    };
  }
}

// Map HTTP status codes and API error messages to user-friendly errors
export function mapApiError(statusCode: number, apiMessage?: string): WeatherApiError {
  // Check for specific error patterns in the message
  const message = apiMessage?.toLowerCase() || '';

  if (statusCode === 401) {
    return new WeatherApiError(
      'API_KEY_INVALID',
      'Invalid API key. Please check your OpenWeatherMap API key configuration.',
      statusCode
    );
  }

  if (statusCode === 404 || message.includes('city not found')) {
    return new WeatherApiError(
      'CITY_NOT_FOUND',
      'City not found. Please check the spelling or try a different city name.',
      statusCode
    );
  }

  if (statusCode === 429) {
    return new WeatherApiError(
      'RATE_LIMIT_EXCEEDED',
      'API rate limit exceeded. Please wait a moment before trying again.',
      statusCode
    );
  }

  if (statusCode >= 500) {
    return new WeatherApiError(
      'SERVER_ERROR',
      'OpenWeatherMap server error. Please try again later.',
      statusCode
    );
  }

  // Default case
  return new WeatherApiError(
    'UNKNOWN_ERROR',
    apiMessage || 'An unexpected error occurred while fetching weather data.',
    statusCode
  );
}

// Map network/fetch errors to user-friendly errors
export function mapNetworkError(error: Error): WeatherApiError {
  if (error.message.includes('fetch') || error.message.includes('network')) {
    return new WeatherApiError(
      'NETWORK_ERROR',
      'Network error. Please check your internet connection and try again.',
      undefined,
      error
    );
  }

  return new WeatherApiError(
    'UNKNOWN_ERROR',
    error.message || 'An unexpected error occurred.',
    undefined,
    error
  );
}
