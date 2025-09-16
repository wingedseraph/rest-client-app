'use client';
import { useState } from 'react';

import { Link, useRouter } from '@/i18n/navigation';
import { getFirebaseErrorMessageKey } from '@/lib/errorHelper';
import { type AuthFormData, createAuthSchema } from '@/lib/validation';
import { firebaseAuthService } from '@/services/authService';
import { Button } from '@/shared/ui/button';

import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

export default function Login() {
  const tForm = useTranslations('FormDataAndErrors');
  const tFirebase = useTranslations('FirebaseErrors');
  const authSchema = createAuthSchema(tForm);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [firebaseError, setFirebaseError] = useState<string>('');
  const router = useRouter();

  const onSubmit = async (data: AuthFormData) => {
    setFirebaseError('');
    try {
      const userCredential =
        await firebaseAuthService.logInWithEmailAndPassword(
          data.email,
          data.password,
        );

      if (userCredential?.user) {
        router.push('/rest-client');
        router.refresh();
      }
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const key = getFirebaseErrorMessageKey(error.code);
        const msg = tFirebase(key);
        setFirebaseError(msg);
        setError('root', { message: msg });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center font-extrabold text-3xl text-gray-900">
            {tForm('log-in')}
          </h2>
          <p className="mt-2 text-center text-gray-600 text-sm">
            {tForm('or')}{' '}
            <Link
              href="/register"
              className="font-medium text-muted-foreground no-underline hover:text-foreground"
            >
              {tForm('create-account')}
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {firebaseError && (
            <div className="rounded-md border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              {firebaseError}
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block font-medium text-gray-700 text-sm"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`mt-1 block w-full rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 focus:ring-foreground sm:text-sm ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="@email.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="mt-1 text-red-600 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block font-medium text-gray-700 text-sm"
            >
              {tForm('password')}
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`focus:foreground mt-1 block w-full rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-1 focus:ring-foreground sm:text-sm ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={tForm('insert-password')}
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-red-600 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Button
              disabled={isSubmitting}
              type="submit"
              variant="default"
              className="w-full justify-center bg-foreground text-background text-sm no-underline"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-white border-b-2"></div>
              ) : (
                tForm('log-in')
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
