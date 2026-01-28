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
    update: {
      method: 'POST' as const,
      path: '/api/progress',
      input: z.object({ level: z.number() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      }
    },
    updateSettings: {
      method: 'PATCH' as const,
      path: '/api/settings',
      input: z.object({ sound: z.boolean().optional(), darkMode: z.boolean().optional() }),
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
