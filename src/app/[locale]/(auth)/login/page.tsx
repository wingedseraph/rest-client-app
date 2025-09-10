'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getFirebaseErrorMessage } from '@/lib/errorHelper';
import { type AuthFormData, authSchema } from '@/lib/validation';

import { logInWithEmailAndPassword } from '../../../../../firebase';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { useForm } from 'react-hook-form';

export default function Login() {
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
      await logInWithEmailAndPassword(data.email, data.password);
      router.push('/rest-client');
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        const errorMessage = getFirebaseErrorMessage(error.code);
        setFirebaseError(errorMessage);
        setError('root', { message: errorMessage });
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center font-extrabold text-3xl text-gray-900">
            Log in
          </h2>
          <p className="mt-2 text-center text-gray-600 text-sm">
            or
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create new account
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
              className={`mt-1 block w-full rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
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
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className={`mt-1 block w-full rounded-md border px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Pleae provide your password"
              {...register('password')}
            />
            {errors.password && (
              <p className="mt-1 text-red-600 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-white border-b-2"></div>
              ) : (
                'Log in'
              )}
            </button>
          </div>
          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-blue-600 text-sm hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
