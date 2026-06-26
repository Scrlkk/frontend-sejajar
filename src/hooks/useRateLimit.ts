import { useState, useEffect, useCallback } from 'react';

export interface UseRateLimitResult {
  isRateLimited: boolean;
  retryAfter: number | null;
  reset: () => void;
}

export function useRateLimit(): UseRateLimitResult {
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  useEffect(() => {
    const handleRateLimit = (event: Event) => {
      const customEvent = event as CustomEvent<{ retryAfter: number }>;
      const seconds = customEvent.detail.retryAfter || 60; // default to 60s
      setRetryAfter(seconds);
    };

    window.addEventListener('api-rate-limit', handleRateLimit);
    return () => {
      window.removeEventListener('api-rate-limit', handleRateLimit);
    };
  }, []);

  // Countdown timer for rate limiting
  useEffect(() => {
    if (retryAfter === null || retryAfter <= 0) return;

    const timer = setInterval(() => {
      setRetryAfter((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [retryAfter]);

  const reset = useCallback(() => {
    setRetryAfter(null);
  }, []);

  const isRateLimited = retryAfter !== null && retryAfter > 0;

  return {
    isRateLimited,
    retryAfter,
    reset,
  };
}
