'use server';

import { cookies } from 'next/headers';

import type { HttpRequest } from '@/features/RequestForm/useSharedRequest';
import { db } from '@/lib/firebase/client';

import { collection, getDocs, query, where } from 'firebase/firestore';

interface UserData {
  uid: string;
  name: string;
  authProvider: string;
  email: string;
  authToken?: string;
  requests?: HttpRequest[];
}

export async function getAuthenticatedUser(): Promise<UserData | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get('authToken')?.value;

    if (!token) {
      return null;
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('authToken', '==', token));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data() as UserData;

    return {
      ...userData,
      uid: userDoc.id,
    };
  } catch (error) {
    console.error('Error getting authenticated user:', error);
    return null;
  }
}

export async function getUserRequests(): Promise<HttpRequest[]> {
  try {
    const user = await getAuthenticatedUser();
    return user?.requests || [];
  } catch (error) {
    console.error('Error getting user requests:', error);
    return [];
  }
}
