import type {
  DocumentData,
  DocumentReference,
  Firestore,
} from 'firebase/firestore';
import { vi } from 'vitest';

vi.mock('firebase/firestore', async () => {
  const actual =
    await vi.importActual<typeof import('firebase/firestore')>(
      'firebase/firestore',
    );
  return {
    ...actual,
    getFirestore: vi.fn(() => ({}) as Firestore),
    doc: vi.fn(() => ({}) as DocumentReference<DocumentData>),
    setDoc: vi.fn(),
  };
});
