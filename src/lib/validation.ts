import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password should be of length at least 8 symbols')
    .regex(/[A-Z]/, 'Password should use at least one uppercase letter')
    .regex(/[0-9]/, 'Password should use at least one numeric symbol'),
});

export const registerSchema = authSchema.extend({
  name: z.string().min(3, 'Name should contain more than three letters'),
});

export type AuthFormData = z.infer<typeof authSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

//
