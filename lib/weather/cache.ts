import { CacheEntry } from './types.js';

// Simple in-memory cache for API responses
export class WeatherCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTtlMs: number;

  constructor(defaultTtlMs: number = 5 * 60 * 1000) {
    // Default 5 minutes
    this.defaultTtlMs = defaultTtlMs;
  }

  // Generate a cache key from the request parameters
  generateKey(endpoint: string, params: Record<string, string | number | undefined>): string {
    const sortedParams = Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    return `${endpoint}?${sortedParams}`;
  }

  // Get cached data if it exists and hasn't expired
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.defaultTtlMs) {
      // Cache expired, remove it
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // Store data in cache
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Clear all cached data
  clear(): void {
    this.cache.clear();
  }

  // Clear expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.defaultTtlMs) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  // Check if a key exists and is not expired
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Delete a specific cache entry
  delete(key: string): boolean {
    return this.cache.delete(key);
  }
}

// Singleton instance for application-wide caching
let globalCache: WeatherCache | null = null;

export function getGlobalCache(ttlMs?: number): WeatherCache {
  if (!globalCache) {
    globalCache = new WeatherCache(ttlMs);
  }
  return globalCache;
}

export function clearGlobalCache(): void {
  globalCache?.clear();
  globalCache = null;
}
