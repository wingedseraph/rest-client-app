import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({ user: { token } }, { status: 200 });
}
