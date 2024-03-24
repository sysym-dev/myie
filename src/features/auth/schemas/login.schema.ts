import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({
      required_error: 'email is required',
      invalid_type_error: 'email must be a string',
    })
    .email({
      message: 'email must be a valid email',
    }),
  password: z
    .string({
      required_error: 'password is required',
      invalid_type_error: 'password must be a string',
    })
    .min(1, { message: 'password is required' }),
});
