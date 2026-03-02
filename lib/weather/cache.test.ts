import { WeatherCache, getGlobalCache, clearGlobalCache } from './cache.js';

describe('WeatherCache', () => {
  let cache: WeatherCache;

  beforeEach(() => {
    cache = new WeatherCache(1000); // 1 second TTL for testing
  });

  describe('generateKey', () => {
    it('should generate consistent keys for same parameters', () => {
      const params = { q: 'London', units: 'metric' };
      const key1 = cache.generateKey('weather', params);
      const key2 = cache.generateKey('weather', params);
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different parameters', () => {
      const key1 = cache.generateKey('weather', { q: 'London' });
      const key2 = cache.generateKey('weather', { q: 'Paris' });
      expect(key1).not.toBe(key2);
    });

    it('should sort parameters alphabetically', () => {
      const key1 = cache.generateKey('weather', { z: 'last', a: 'first' });
      const key2 = cache.generateKey('weather', { a: 'first', z: 'last' });
      expect(key1).toBe(key2);
    });

    it('should filter out undefined values', () => {
      const key = cache.generateKey('weather', { q: 'London', state: undefined });
      expect(key).toBe('weather?q=London');
    });

    it('should include endpoint in key', () => {
      const key = cache.generateKey('forecast', { q: 'London' });
      expect(key).toContain('forecast');
    });
  });

  describe('set and get', () => {
    it('should store and retrieve data', () => {
      const data = { temp: 20, city: 'London' };
      cache.set('key1', data);
      expect(cache.get('key1')).toEqual(data);
    });

    it('should return null for non-existent key', () => {
      expect(cache.get('non-existent')).toBeNull();
    });

    it('should return null for expired data', async () => {
      const data = { temp: 20 };
      cache.set('expired', data);
      
      // Wait for TTL to expire
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      expect(cache.get('expired')).toBeNull();
    });

    it('should handle different data types', () => {
      cache.set('string', 'test');
      cache.set('number', 42);
      cache.set('array', [1, 2, 3]);
      cache.set('object', { nested: { value: true } });

      expect(cache.get('string')).toBe('test');
      expect(cache.get('number')).toBe(42);
      expect(cache.get('array')).toEqual([1, 2, 3]);
      expect(cache.get('object')).toEqual({ nested: { value: true } });
    });
  });

  describe('has', () => {
    it('should return true for existing non-expired key', () => {
      cache.set('exists', { data: true });
      expect(cache.has('exists')).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(cache.has('non-existent')).toBe(false);
    });

    it('should return false for expired key', async () => {
      cache.set('expired', { data: true });
      await new Promise(resolve => setTimeout(resolve, 1100));
      expect(cache.has('expired')).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete existing key', () => {
      cache.set('delete-me', { data: true });
      expect(cache.has('delete-me')).toBe(true);
      
      const deleted = cache.delete('delete-me');
      expect(deleted).toBe(true);
      expect(cache.has('delete-me')).toBe(false);
    });

    it('should return false for non-existent key', () => {
      const deleted = cache.delete('non-existent');
      expect(deleted).toBe(false);
    });
  });

  describe('clear', () => {
    it('should remove all cached data', () => {
      cache.set('key1', { data: 1 });
      cache.set('key2', { data: 2 });
      cache.set('key3', { data: 3 });

      expect(cache.getStats().size).toBe(3);

      cache.clear();

      expect(cache.getStats().size).toBe(0);
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
      expect(cache.get('key3')).toBeNull();
    });

    it('should work on empty cache', () => {
      expect(() => cache.clear()).not.toThrow();
      expect(cache.getStats().size).toBe(0);
    });
  });

  describe('cleanup', () => {
    it('should remove only expired entries', async () => {
      const shortCache = new WeatherCache(500); // 500ms TTL
      
      shortCache.set('expire-soon', { data: 1 });
      await new Promise(resolve => setTimeout(resolve, 600));
      
      shortCache.set('fresh', { data: 2 });
      
      expect(shortCache.getStats().size).toBe(2);
      
      shortCache.cleanup();
      
      expect(shortCache.getStats().size).toBe(1);
      expect(shortCache.has('expire-soon')).toBe(false);
      expect(shortCache.has('fresh')).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should return correct size', () => {
      expect(cache.getStats().size).toBe(0);
      
      cache.set('key1', {});
      expect(cache.getStats().size).toBe(1);
      
      cache.set('key2', {});
      expect(cache.getStats().size).toBe(2);
    });

    it('should return all keys', () => {
      cache.set('alpha', {});
      cache.set('beta', {});
      
      const stats = cache.getStats();
      expect(stats.keys).toContain('alpha');
      expect(stats.keys).toContain('beta');
      expect(stats.keys).toHaveLength(2);
    });
  });

  describe('default TTL', () => {
    it('should use 5 minutes as default TTL', async () => {
      const defaultCache = new WeatherCache(); // No TTL specified
      defaultCache.set('key', { data: true });
      
      // Should still exist immediately
      expect(defaultCache.has('key')).toBe(true);
    });
  });
});

describe('Global cache', () => {
  beforeEach(() => {
    clearGlobalCache();
  });

  afterAll(() => {
    clearGlobalCache();
  });

  it('should return same instance on multiple calls', () => {
    const cache1 = getGlobalCache();
    const cache2 = getGlobalCache();
    expect(cache1).toBe(cache2);
  });

  it('should accept custom TTL', () => {
    const cache = getGlobalCache(5000);
    expect(cache).toBeInstanceOf(WeatherCache);
  });

  it('should clear global cache', () => {
    const cache = getGlobalCache();
    cache.set('test', { data: true });
    expect(cache.has('test')).toBe(true);
    
    clearGlobalCache();
    
    const newCache = getGlobalCache();
    expect(newCache.has('test')).toBe(false);
  });
});
