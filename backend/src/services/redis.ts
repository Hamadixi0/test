import { createClient, RedisClientType } from 'redis';

export class RedisService {
  private static instance: RedisClientType;

  public static getInstance(): RedisClientType {
    if (!RedisService.instance) {
      RedisService.instance = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      });

      RedisService.instance.on('error', (err) => {
        console.error('Redis Client Error:', err);
      });

      RedisService.instance.on('connect', () => {
        console.log('Redis Client Connected');
      });
    }
    return RedisService.instance;
  }

  public static async initialize(): Promise<void> {
    const client = RedisService.getInstance();
    if (!client.isOpen) {
      await client.connect();
    }
  }

  public static async healthCheck(): Promise<void> {
    const client = RedisService.getInstance();
    await client.ping();
  }

  public static async disconnect(): Promise<void> {
    if (RedisService.instance && RedisService.instance.isOpen) {
      await RedisService.instance.disconnect();
    }
  }

  // Helper methods for common operations
  public static async set(key: string, value: string, ttl?: number): Promise<void> {
    const client = RedisService.getInstance();
    if (ttl) {
      await client.setEx(key, ttl, value);
    } else {
      await client.set(key, value);
    }
  }

  public static async get(key: string): Promise<string | null> {
    const client = RedisService.getInstance();
    return await client.get(key);
  }

  public static async del(key: string): Promise<void> {
    const client = RedisService.getInstance();
    await client.del(key);
  }

  public static async exists(key: string): Promise<boolean> {
    const client = RedisService.getInstance();
    return (await client.exists(key)) === 1;
  }
}

// Export singleton instance
export const redis = RedisService.getInstance();