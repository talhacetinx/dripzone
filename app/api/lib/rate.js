import { LRUCache } from "lru-cache"

export const ALLOWED_ORIGINS = [
  "https://dripzonemusic.com",
  "https://dripzonemusic.com/",
  "https://www.dripzonemusic.com",
  "https://www.dripzonemusic.com/",
  "http://localhost:3000",
  "http://localhost:3000/",
  process.env.NEXT_PUBLIC_BASE_URL // Environment variable'dan da okuyalım
].filter(Boolean); // undefined değerleri filtrele

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