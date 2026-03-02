import { WeatherApiError, mapApiError, mapNetworkError } from './errors.js';


describe('WeatherApiError', () => {
  it('should create error with all properties', () => {
    const originalError = new Error('Original');
    const error = new WeatherApiError(
      'API_KEY_INVALID',
      'Invalid API key',
      401,
      originalError
    );

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('WeatherApiError');
    expect(error.code).toBe('API_KEY_INVALID');
    expect(error.message).toBe('Invalid API key');
    expect(error.statusCode).toBe(401);
    expect(error.originalError).toBe(originalError);
  });

  it('should create error without optional properties', () => {
    const error = new WeatherApiError('UNKNOWN_ERROR', 'Something went wrong');

    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBeUndefined();
    expect(error.originalError).toBeUndefined();
  });

  it('should convert to JSON representation', () => {
    const originalError = new Error('Original');
    const error = new WeatherApiError(
      'CITY_NOT_FOUND',
      'City not found',
      404,
      originalError
    );

    const json = error.toJSON();
    expect(json.code).toBe('CITY_NOT_FOUND');
    expect(json.message).toBe('City not found');
    expect(json.statusCode).toBe(404);
    expect(json.originalError).toBe(originalError);
  });

  it('should be catchable as Error', () => {
    try {
      throw new WeatherApiError('SERVER_ERROR', 'Server error');
    } catch (e) {
      expect(e).toBeInstanceOf(Error);
      expect(e).toBeInstanceOf(WeatherApiError);
    }
  });
});

describe('mapApiError', () => {
  it('should map 401 to API_KEY_INVALID', () => {
    const error = mapApiError(401, 'Invalid API key');
    
    expect(error).toBeInstanceOf(WeatherApiError);
    expect(error.code).toBe('API_KEY_INVALID');
    expect(error.statusCode).toBe(401);
    expect(error.message).toContain('Invalid API key');
  });

  it('should map 404 to CITY_NOT_FOUND', () => {
    const error = mapApiError(404, 'city not found');
    
    expect(error.code).toBe('CITY_NOT_FOUND');
    expect(error.statusCode).toBe(404);
    expect(error.message).toContain('City not found');
  });

  it('should map 404 without message to CITY_NOT_FOUND', () => {
    const error = mapApiError(404);
    
    expect(error.code).toBe('CITY_NOT_FOUND');
    expect(error.statusCode).toBe(404);
  });

  it('should map 429 to RATE_LIMIT_EXCEEDED', () => {
    const error = mapApiError(429, 'rate limit exceeded');
    
    expect(error.code).toBe('RATE_LIMIT_EXCEEDED');
    expect(error.statusCode).toBe(429);
    expect(error.message).toContain('rate limit');
  });

  it('should map 500 to SERVER_ERROR', () => {
    const error = mapApiError(500, 'Internal server error');
    
    expect(error.code).toBe('SERVER_ERROR');
    expect(error.statusCode).toBe(500);
    expect(error.message).toContain('server error');
  });

  it('should map 502 to SERVER_ERROR', () => {
    const error = mapApiError(502);
    
    expect(error.code).toBe('SERVER_ERROR');
    expect(error.statusCode).toBe(502);
  });

  it('should map 503 to SERVER_ERROR', () => {
    const error = mapApiError(503);
    
    expect(error.code).toBe('SERVER_ERROR');
    expect(error.statusCode).toBe(503);
  });

  it('should map unknown status codes to UNKNOWN_ERROR', () => {
    const error = mapApiError(418, 'I am a teapot');
    
    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.statusCode).toBe(418);
    expect(error.message).toBe('I am a teapot');
  });

  it('should use default message when none provided', () => {
    const error = mapApiError(400);
    
    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.message).toBe('An unexpected error occurred while fetching weather data.');
  });

  it('should handle city not found in message', () => {
    const error = mapApiError(400, 'city not found');
    
    expect(error.code).toBe('CITY_NOT_FOUND');
    expect(error.message).toContain('City not found');
  });
});

describe('mapNetworkError', () => {
  it('should map fetch error to NETWORK_ERROR', () => {
    const originalError = new Error('fetch failed');
    const error = mapNetworkError(originalError);
    
    expect(error).toBeInstanceOf(WeatherApiError);
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.message).toContain('Network error');
    expect(error.originalError).toBe(originalError);
  });

  it('should map network error to NETWORK_ERROR', () => {
    const originalError = new Error('network error occurred');
    const error = mapNetworkError(originalError);
    
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.message).toContain('Network error');
  });

  it('should map generic errors to UNKNOWN_ERROR', () => {
    const originalError = new Error('Something else happened');
    const error = mapNetworkError(originalError);
    
    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.message).toBe('Something else happened');
    expect(error.originalError).toBe(originalError);
  });

  it('should handle errors without message', () => {
    const originalError = new Error();
    const error = mapNetworkError(originalError);
    
    expect(error.code).toBe('UNKNOWN_ERROR');
    expect(error.message).toBe('An unexpected error occurred.');
  });
});
