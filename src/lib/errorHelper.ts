export const getFirebaseErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'There is no user with such e-mail',
    'auth/email-already-in-use': 'User with such e-mail already exists',
    'auth/wrong-password': 'Wrong password',
    'auth/invalid-email': 'Wrong email',
    'auth/invalid-credential': 'Wrong credential data',
    'auth/too-many-requests': 'Too much tries. Please try later',
    'auth/user-disabled': 'Account is blocked',
  } as const;

  return errorMessages[errorCode] || 'Error while register';
};
