import { getRedisClient, isRedisConfigured } from './redis';

const GUEST_LIMIT = 2;
const AUTH_LIMIT = 10;
const WINDOW_SECONDS = 86400; // 24 hours

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetInSeconds?: number;
};

/**
 * Check and increment the rate limit counter for a given identifier.
 * Hard-blocks if Upstash is not configured — never fails open.
 */
export async function checkRateLimit(
  identifier: string,
  type: 'guest' | 'user'
): Promise<RateLimitResult> {
  if (!isRedisConfigured()) {
    throw new Error(
      '[BrandFrame] Upstash Redis is not configured. AI calls are blocked.'
    );
  }

  const redis = getRedisClient();
  const limit = type === 'guest' ? GUEST_LIMIT : AUTH_LIMIT;
  const key =
    type === 'guest'
      ? `rl:guest:${identifier}`
      : `rl:user:${identifier}`;

  const current = await redis.incr(key);

  // Set expiry on the first increment only
  if (current === 1) {
    await redis.expire(key, WINDOW_SECONDS);
  }

  const ttl = await redis.ttl(key);

  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    limit,
    resetInSeconds: ttl > 0 ? ttl : WINDOW_SECONDS,
  };
}

export async function getRateLimitStatus(
  identifier: string,
  type: 'guest' | 'user'
): Promise<RateLimitResult> {
  if (!isRedisConfigured()) {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  const redis = getRedisClient();
  const limit = type === 'guest' ? GUEST_LIMIT : AUTH_LIMIT;
  const key =
    type === 'guest'
      ? `rl:guest:${identifier}`
      : `rl:user:${identifier}`;

  const current = (await redis.get<number>(key)) ?? 0;
  const ttl = await redis.ttl(key);

  return {
    allowed: current < limit,
    remaining: Math.max(0, limit - current),
    limit,
    resetInSeconds: ttl > 0 ? ttl : WINDOW_SECONDS,
  };
}
