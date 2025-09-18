import type { HttpRequest } from '@/features/RequestForm/useHttpRequest';
import { auth, db } from '@/lib/firebase/client';

import { FirebaseError } from 'firebase/app';
import {
  type Auth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type UserCredential,
} from 'firebase/auth';
import {
  arrayUnion,
  doc,
  type Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';

interface UserData {
  uid: string;
  name: string;
  authProvider: string;
  email: string;
  requests?: HttpRequest[];
}

class FirebaseAuthService {
  private auth: Auth;
  private db: Firestore;

  constructor() {
    this.auth = auth;
    this.db = db;
  }

  async logInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      return userCredential;
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new Error(`Login failed: ${err.message}`);
      }
      throw new Error('Login failed: Unknown error');
    }
  }

  async registerWithEmailAndPassword(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    try {
      const res: UserCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      );
      const user = res.user;

      const userData: UserData = {
        uid: user.uid,
        name,
        authProvider: 'local',
        email,
      };

      await setDoc(doc(this.db, 'users', user.uid), userData);
      return user;
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new Error(`Registration failed: ${err.message}`);
      }
      throw new Error('Registration failed: Unknown error');
    }
  }

  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new Error(`Password reset failed: ${err.message}`);
      }
      throw new Error('Password reset failed: Unknown error');
    }
  }

  logout(): void {
    signOut(this.auth);
  }

  getAuthInstance(): Auth {
    return this.auth;
  }

  getFirestoreInstance(): Firestore {
    return this.db;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async saveUserRequest(uid: string, requestData: HttpRequest): Promise<void> {
    try {
      const userRef = doc(this.db, 'users', uid);

      await updateDoc(userRef, {
        requests: arrayUnion({
          ...requestData,
        }),
      });
    } catch (err: unknown) {
      throw new Error(`${err}`);
    }
  }
  async getUserDbData(uid: string): Promise<HttpRequest[] | undefined> {
    try {
      const userDocRef = doc(this.db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const requests = userDocSnap.data() as UserData;
        return requests.requests;
      } else {
        return undefined;
      }
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new Error(`Failed to get user data: ${err.message}`);
      }
      throw new Error('Failed to get user data: Unknown error');
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService();
