/**
 * Minimal per-user rate limiter.
 *
 * Scoped to a single function instance (in-memory Map). On Vercel that means
 * the limit is per warm instance, not globally exact — good enough to stop
 * accidental quota burns, and cheap to replace with a DB or Redis later.
 */

const buckets = new Map<string, number[]>();

const HOUR_MS = 60 * 60 * 1000;

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

/**
 * Allow `limit` calls per `windowMs` for the given key.
 * Returns ok=false once the window is exhausted.
 */
export function rateLimit(
  key: string,
  opts: { limit?: number; windowMs?: number } = {}
): RateLimitResult {
  const limit = opts.limit ?? (Number(process.env.AI_RATE_LIMIT_PER_HOUR) || 40);
  const windowMs = opts.windowMs ?? HOUR_MS;

  const now = Date.now();
  const stamps = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (stamps.length >= limit) {
    const oldest = stamps[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + windowMs - now) / 1000));
    buckets.set(key, stamps);
    return { ok: false, retryAfterSeconds };
  }

  stamps.push(now);
  buckets.set(key, stamps);
  return { ok: true };
}