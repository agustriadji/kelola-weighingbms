// Simple in-memory cache
const cache = new Map<string, { data: any; expires: number }>();

export const setCache = (key: string, data: any, ttlSeconds = 300) => {
  cache.set(key, {
    data,
    expires: Date.now() + (ttlSeconds * 1000)
  });
};

export const getCache = (key: string) => {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
};

export const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};