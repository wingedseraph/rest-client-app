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
import { doc, type Firestore, setDoc } from 'firebase/firestore';

interface UserData {
  uid: string;
  name: string;
  authProvider: string;
  email: string;
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
}

export const firebaseAuthService = new FirebaseAuthService();
