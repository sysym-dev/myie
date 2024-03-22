import { z } from 'zod';
import { createTransactionSchema } from './schemas/create.schema';
import { database } from '../../core/database/database';

interface Transaction {}

export async function createTransaction(
  data: z.infer<typeof createTransactionSchema>,
): Promise<Transaction> {
  return await database<Transaction>('transactions').insert(data);
}
