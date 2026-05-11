import { Redis } from "@upstash/redis"

const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

let redis: Redis | null = null

if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  })
}

// Simple in-memory cache fallback
const inMemoryCache = new Map<string, { data: any; expiry: number }>()

export async function getCache<T>(key: string): Promise<T | null> {
  if (redis) {
    try {
      return await redis.get<T>(key)
    } catch (error) {
      console.error("Redis get error:", error)
    }
  }

  const cached = inMemoryCache.get(key)
  if (cached) {
    if (Date.now() < cached.expiry) {
      return cached.data as T
    }
    inMemoryCache.delete(key)
  }

  return null
}

export async function setCache(key: string, data: any, ttlSeconds: number = 14 * 24 * 60 * 60): Promise<void> {
  if (redis) {
    try {
      await redis.set(key, data, { ex: ttlSeconds })
      return
    } catch (error) {
      console.error("Redis set error:", error)
    }
  }

  inMemoryCache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000,
  })
}

export function generateCacheKey(name: string, location: string, category: string): string {
  const normalized = `${name}:${location}:${category}`.toLowerCase().replace(/\s+/g, "_")
  return `audit:${normalized}`
}
