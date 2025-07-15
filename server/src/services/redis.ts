import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType;

export async function initializeRedis(): Promise<RedisClientType> {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    redisClient.on('ready', () => {
      console.log('Redis Client Ready');
    });

    await redisClient.connect();
    
    console.log('Redis connection established successfully');
    return redisClient;
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis not initialized. Call initializeRedis() first.');
  }
  return redisClient;
}

// Cache helpers
export async function setCache(key: string, value: any, expireInSeconds?: number): Promise<void> {
  const client = getRedisClient();
  const serializedValue = JSON.stringify(value);
  
  if (expireInSeconds) {
    await client.setEx(key, expireInSeconds, serializedValue);
  } else {
    await client.set(key, serializedValue);
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  const value = await client.get(key);
  
  if (!value) return null;
  
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Error parsing cached value:', error);
    return null;
  }
}

export async function deleteCache(key: string): Promise<void> {
  const client = getRedisClient();
  await client.del(key);
}

export async function deleteCachePattern(pattern: string): Promise<void> {
  const client = getRedisClient();
  const keys = await client.keys(pattern);
  
  if (keys.length > 0) {
    await client.del(keys);
  }
}

// Session helpers
export async function setSession(sessionId: string, data: any, expireInSeconds: number = 86400): Promise<void> {
  await setCache(`session:${sessionId}`, data, expireInSeconds);
}

export async function getSession<T>(sessionId: string): Promise<T | null> {
  return await getCache<T>(`session:${sessionId}`);
}

export async function deleteSession(sessionId: string): Promise<void> {
  await deleteCache(`session:${sessionId}`);
}

// Market data cache helpers
export async function setMarketData(ticker: string, data: any, expireInSeconds: number = 60): Promise<void> {
  await setCache(`market:${ticker}`, data, expireInSeconds);
}

export async function getMarketData<T>(ticker: string): Promise<T | null> {
  return await getCache<T>(`market:${ticker}`);
}

// Alert cache helpers
export async function setActiveAlerts(userId: string, alerts: any[]): Promise<void> {
  await setCache(`alerts:${userId}`, alerts, 300); // 5 minutes
}

export async function getActiveAlerts<T>(userId: string): Promise<T[] | null> {
  return await getCache<T[]>(`alerts:${userId}`);
}

// User online status
export async function setUserOnline(userId: string): Promise<void> {
  await setCache(`online:${userId}`, true, 300); // 5 minutes
}

export async function isUserOnline(userId: string): Promise<boolean> {
  const status = await getCache<boolean>(`online:${userId}`);
  return status === true;
}

export async function setUserOffline(userId: string): Promise<void> {
  await deleteCache(`online:${userId}`);
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient && redisClient.isOpen) {
    await redisClient.disconnect();
    console.log('Redis connection closed');
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await disconnectRedis();
});

export { redisClient };