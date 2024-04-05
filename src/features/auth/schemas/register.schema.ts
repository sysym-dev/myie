import { z } from 'zod';

export const registerSchema = z.object({
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
password_confirmation: z
    .string({
    required_error: 'password confirmation is required',
    invalid_type_error: 'password confirmation must be a string',
    })
    .min(1, { message: 'password confirmation is required' }),
}).refine(values => values.password === values.password_confirmation, {
    message: 'password confirmation doesn\'t match',
    path: ['password_confirmation']
});
