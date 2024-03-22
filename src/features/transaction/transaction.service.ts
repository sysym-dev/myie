import { z } from 'zod';
import { createTransactionSchema } from './schemas/create.schema';
import { database } from '../../core/database/database';

interface Transaction {}
interface Paginated<T> {
  rows: T[];
  meta: {
    count: number;
  };
}

export async function createTransaction(
  data: z.infer<typeof createTransactionSchema>,
): Promise<Transaction> {
  return await database<Transaction>('transactions').insert(data);
}

export async function readTransactions(params?: {
  start_at?: Date;
  sort?: {
    column: 'created_at';
    direction: 'asc' | 'desc';
  };
  paginated?: boolean;
}): Promise<Transaction[] | Paginated<Transaction>> {
  const query = database<Transaction>('transactions');

  if (params?.sort) {
    query.orderBy(params.sort.column, params.sort.direction);
  }

  const rows = await query.select();

  if (params?.paginated) {
    return {
      rows,
      meta: {
        count: await query.count(),
      },
    };
  }

  return rows;
}
