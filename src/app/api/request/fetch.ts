import type { RequestData, ResponseData } from './schema';
import { responseSchema } from './schema';

export async function fetchExternal({
  url,
  method,
  headers = {},
  body,
}: RequestData): Promise<ResponseData> {
  const start = Date.now();
  const response = await fetch(url, {
    method: method.toUpperCase(),
    headers: headers as Record<string, string>,
    body: body ? JSON.stringify(body) : null,
  });
  const elapsed = Date.now() - start;

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    data = await response.text();
  }

  return responseSchema.parse({
    status: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    data,
    responseTime: elapsed,
  });
}
