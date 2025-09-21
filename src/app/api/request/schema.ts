import { z } from 'zod';

export const requestSchema = z.object({
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string(), z.string()).optional(),
  body: z.union([z.object(), z.string()]).optional(),
  size: z.number(),
  duration: z.number(),
  timestamp: z.string(),
});

export const responseSchema = z.object({
  status: z.number(),
  statusText: z.string(),
  headers: z.record(z.string(), z.string()).optional().nullable(),
  data: z.unknown(),
  responseTime: z.number(),
});

export type RequestData = z.infer<typeof requestSchema>;
export type ResponseData = z.infer<typeof responseSchema>;
