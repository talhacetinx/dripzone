import { LRUCache } from "lru-cache"

export const ALLOWED_ORIGINS = ["http://localhost:3000", "https://dripzone-topaz.vercel.app"];

const rateLimitOptions = {
  max: 25,
  ttl: 1000 * 60,
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