import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.coerce
    .number({
      invalid_type_error: 'amount must be a number',
      required_error: 'amount required',
    })
    .positive({ message: 'amount must be positive' }),
  type: z.enum(['income', 'expense'], {
    invalid_type_error: 'type must be income or expense',
    required_error: 'type required',
  }),
});
