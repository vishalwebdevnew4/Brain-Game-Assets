import { z } from 'zod';
import { users } from './schema';

export const api = {
  progress: {
    get: {
      method: 'GET' as const,
      path: '/api/progress',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        404: z.object({ message: z.string() })
      }
    },
    complete: {
      method: 'POST' as const,
      path: '/api/progress/complete',
      input: z.object({ level: z.number(), completed: z.boolean() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      }
    },
    updateSettings: {
      method: 'PATCH' as const,
      path: '/api/settings',
      input: z.object({ sound: z.boolean().optional(), music: z.boolean().optional(), darkMode: z.boolean().optional() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      }
    },
    useHint: {
      method: 'POST' as const,
      path: '/api/hint',
      input: z.object({ level: z.number() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: z.object({ message: z.string() })
      }
    },
    addCoins: {
      method: 'POST' as const,
      path: '/api/coins',
      input: z.object({ amount: z.number() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      }
    },
    skipLevel: {
      method: 'POST' as const,
      path: '/api/skip',
      input: z.object({ level: z.number() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: z.object({ message: z.string() })
      }
    },
    resetProgress: {
      method: 'POST' as const,
      path: '/api/reset',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      }
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export const HINT_COST = 50;
export const SKIP_COST = 100;
export const LEVEL_REWARD = 10;
export const TOTAL_LEVELS = 100;
