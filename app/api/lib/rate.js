import { LRUCache } from "lru-cache"

export const ALLOWED_ORIGINS = ["http://localhost:3000", "https://dripzonemusic.com/"];

const rateLimitOptions = {
  max: 100, // 25'ten 100'e çıkardık
  ttl: 1000 * 60, // 1 dakika
}

const tokenCache = new LRUCache({
  max: 500,
  ttl: rateLimitOptions.ttl,
})

export function checkRateLimit(ip) {
  const count = tokenCache.get(ip) || 0
  if (count >= rateLimitOptions.max) {
    return false
  }
  tokenCache.set(ip, count + 1)
  return true
}