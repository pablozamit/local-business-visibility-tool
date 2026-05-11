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

export async function setCache(key: string, data: any, ttlSeconds?: number): Promise<void> {
  if (redis) {
    const finalTtl = ttlSeconds ?? 14 * 24 * 60 * 60 // 14 días por defecto para Redis
    try {
      await redis.set(key, data, { ex: finalTtl })
      return
    } catch (error) {
      console.error("Redis set error:", error)
    }
  }

  // Fallback a memoria: 60 minutos por defecto si no se especifica
  const finalTtl = ttlSeconds ?? 60 * 60
  inMemoryCache.set(key, {
    data,
    expiry: Date.now() + finalTtl * 1000,
  })
}

export function generateCacheKey(name: string, location: string, category: string): string {
  const normalized = `${name}:${location}:${category}`.toLowerCase().replace(/\s+/g, "_")
  return `audit:${normalized}`
}
