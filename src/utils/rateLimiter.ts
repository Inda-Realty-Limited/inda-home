type RateLimitEntry = {
  count: number;
  resetTime: number;
  blockedUntil?: number;
};

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
    }
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
        this.limits.delete(key);
      }
    }
  }

  checkLimit(
    key: string,
    maxAttempts: number,
    windowMs: number,
    blockDurationMs?: number
  ): { allowed: boolean; remainingAttempts: number; resetIn: number; blockedFor?: number } {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (entry?.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetIn: entry.blockedUntil - now,
        blockedFor: entry.blockedUntil - now,
      };
    }

    if (!entry || entry.resetTime < now) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return {
        allowed: true,
        remainingAttempts: maxAttempts - 1,
        resetIn: windowMs,
      };
    }

    entry.count++;

    if (entry.count > maxAttempts) {
      if (blockDurationMs) {
        entry.blockedUntil = now + blockDurationMs;
      }
      return {
        allowed: false,
        remainingAttempts: 0,
        resetIn: entry.resetTime - now,
        blockedFor: blockDurationMs ? blockDurationMs : undefined,
      };
    }

    return {
      allowed: true,
      remainingAttempts: maxAttempts - entry.count,
      resetIn: entry.resetTime - now,
    };
  }

  reset(key: string) {
    this.limits.delete(key);
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.limits.clear();
  }
}

export const rateLimiter = new RateLimiter();

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const preventDoubleClick = <T extends (...args: any[]) => Promise<any>>(
  asyncFunc: T
): ((...args: Parameters<T>) => Promise<ReturnType<T> | void>) => {
  let isExecuting = false;
  
  return async (...args: Parameters<T>): Promise<ReturnType<T> | void> => {
    if (isExecuting) {
      return;
    }
    
    isExecuting = true;
    try {
      return await asyncFunc(...args);
    } finally {
      isExecuting = false;
    }
  };
};

export const createLoginLimiter = (userIdentifier: string) => {
  const key = `login:${userIdentifier}`;
  const maxAttempts = 5;
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const blockDurationMs = 30 * 60 * 1000; // 30 minutes

  return {
    checkLimit: () => rateLimiter.checkLimit(key, maxAttempts, windowMs, blockDurationMs),
    reset: () => rateLimiter.reset(key),
  };
};

export const createFormSubmitLimiter = (formId: string) => {
  const key = `form:${formId}`;
  const maxAttempts = 3;
  const windowMs = 10 * 1000; // 10 seconds

  return {
    checkLimit: () => rateLimiter.checkLimit(key, maxAttempts, windowMs),
    reset: () => rateLimiter.reset(key),
  };
};


