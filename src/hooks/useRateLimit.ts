import { useState, useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  blockDurationMs?: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked?: boolean;
  blockExpiry?: number;
}

const DEFAULT_CONFIGS = {
  publicApi: { maxRequests: 100, windowMs: 60000, blockDurationMs: 300000 }, // 100 req/min, block for 5min
  shopView: { maxRequests: 50, windowMs: 60000, blockDurationMs: 180000 },   // 50 req/min, block for 3min
  search: { maxRequests: 30, windowMs: 60000, blockDurationMs: 120000 },     // 30 req/min, block for 2min
} as const;

export const useRateLimit = () => {
  const limitsRef = useRef<Map<string, RateLimitEntry>>(new Map());

  const getClientIdentifier = useCallback(() => {
    // Use multiple identifiers for better rate limiting
    const fingerprint = [
      navigator.userAgent || '',
      navigator.language || '',
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset()
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `client_${Math.abs(hash)}`;
  }, []);

  const checkRateLimit = useCallback((
    action: keyof typeof DEFAULT_CONFIGS | string,
    customConfig?: RateLimitConfig
  ): { allowed: boolean; remaining: number; resetTime: number; blocked?: boolean } => {
    const clientId = getClientIdentifier();
    const key = `${clientId}_${action}`;
    const now = Date.now();
    
    const config = customConfig || DEFAULT_CONFIGS[action as keyof typeof DEFAULT_CONFIGS] || DEFAULT_CONFIGS.publicApi;
    const limits = limitsRef.current;
    let entry = limits.get(key);

    // Check if currently blocked
    if (entry?.blocked && entry.blockExpiry && now < entry.blockExpiry) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.blockExpiry,
        blocked: true
      };
    }

    // Initialize or reset if window expired
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + config.windowMs
      };
    }

    // Increment counter
    entry.count++;
    limits.set(key, entry);

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      // Apply block if configured
      if (config.blockDurationMs) {
        entry.blocked = true;
        entry.blockExpiry = now + config.blockDurationMs;
        limits.set(key, entry);

        logger.security.rateLimitExceeded(
          clientId,
          config.maxRequests,
          `${config.windowMs / 1000}s`
        );

        logger.security.suspiciousActivity('Rate limit exceeded with blocking', {
          action,
          clientId,
          count: entry.count,
          limit: config.maxRequests
        });

        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.blockExpiry,
          blocked: true
        };
      } else {
        // Just deny without blocking
        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.resetTime
        };
      }
    }

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }, [getClientIdentifier]);

  const resetRateLimit = useCallback((action: string) => {
    const clientId = getClientIdentifier();
    const key = `${clientId}_${action}`;
    limitsRef.current.delete(key);
  }, [getClientIdentifier]);

  return {
    checkRateLimit,
    resetRateLimit
  };
};