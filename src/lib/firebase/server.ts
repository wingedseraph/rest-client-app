// lib/firebase/server-auth.ts
import { cookies } from 'next/headers';

import { getAuth, initializeAdminApp } from './admin';

export async function getServerUser() {
  try {
    initializeAdminApp();
    const auth = getAuth();
    const cookieStore = cookies();

    const sessionCookie = cookieStore.get('session');

    if (!sessionCookie?.value) {
      return null;
    }

    const decodedClaims = await auth.verifySessionCookie(
      sessionCookie.value,
      true,
    );
    return decodedClaims;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
