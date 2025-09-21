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
  setDoc,
  updateDoc,
} from 'firebase/firestore';

interface UserData {
  uid: string;
  name: string;
  authProvider: string;
  email: string;
  requests?: HttpRequest[];
  authToken?: string;
}

class FirebaseAuthService {
  private auth: Auth;
  private db: Firestore;

  constructor() {
    this.auth = auth;
    this.db = db;
  }

  private async setToken(user: User): Promise<void> {
    const token = await user.getIdToken();

    await fetch('/api/set-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    await updateDoc(doc(this.db, 'users', user.uid), {
      authToken: token,
    });
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

      const user = userCredential.user;
      await this.setToken(user);

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
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(this.auth, email, password);

      const user = userCredential.user;
      await this.setToken(user);

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

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);

      await fetch('/api/unset-token', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        throw err;
      }
      if (err instanceof Error) {
        throw new Error(`Logout failed: ${err.message}`);
      }
      throw new Error('Logout failed: Unknown error');
    }
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
}

export const firebaseAuthService = new FirebaseAuthService();
