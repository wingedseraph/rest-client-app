export const getFirebaseErrorMessageKey = (errorCode: string): string => {
  const knownCodes: Record<PropertyKey, true> = {
    'auth/user-not-found': true,
    'auth/email-already-in-use': true,
    'auth/wrong-password': true,
    'auth/invalid-email': true,
    'auth/invalid-credential': true,
    'auth/too-many-requests': true,
    'auth/user-disabled': true,
  } as const;

  return knownCodes[errorCode] ? errorCode : 'unknown';
};
