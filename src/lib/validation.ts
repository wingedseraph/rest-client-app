import { z } from 'zod';

export const createAuthSchema = (t: (key: string) => string) => {
  return z.object({
    email: z.string().min(1, t('email-required')).email(t('email-invalid')),
    password: z
      .string()
      .min(1, t('password-required'))
      .min(8, t('password-too-short'))
      .regex(/[A-Z]/, t('password-uppercase'))
      .regex(/[0-9]/, t('password-number')),
  });
};

export const createRegisterSchema = (t: (key: string) => string) => {
  const baseSchema = createAuthSchema(t);

  return baseSchema.extend({
    name: z.string().min(3, t('name-length')),
  });
};

export type AuthFormData = z.infer<ReturnType<typeof createAuthSchema>>;
export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;
