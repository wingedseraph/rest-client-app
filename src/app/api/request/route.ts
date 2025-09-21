import { type NextRequest, NextResponse } from 'next/server';

import { fetchExternal } from './fetch';
import { requestSchema } from './schema';

export async function POST(request: NextRequest) {
  try {
    const input = requestSchema.parse(await request.json());
    const result = await fetchExternal(input);
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
