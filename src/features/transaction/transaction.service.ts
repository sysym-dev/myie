import { z } from 'zod';
import { createTransactionSchema } from './schemas/create.schema';
import { database } from '../../core/database/database';

interface Transaction {}
interface Paginated<T> {
  rows: T[];
  meta: {
    totalPages: number;
    currentPage: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
}

export async function createTransaction(
  data: z.infer<typeof createTransactionSchema>,
): Promise<Transaction[]> {
  return await database<Transaction>('transactions').insert(data);
}

export async function readTransactions(params?: {
  start_at?: Date;
  sort?: {
    column: 'created_at';
    direction: 'asc' | 'desc';
  };
  paginated?: boolean;
  limit?: number;
  page?: number;
}): Promise<Transaction[] | Paginated<Transaction>> {
  const query = database<Transaction>('transactions');

  if (params?.sort) {
    query.orderBy(params.sort.column, params.sort.direction);
  }

  if (params?.limit) {
    query.limit(params.limit);
  }

  if (params?.page) {
    query.offset((params.page - 1) * (params?.limit ?? 1));
  }

  const rows = await query.select();

  if (params?.paginated) {
    const [meta] =
      await database('transactions').count<[Record<'count', number>]>(
        '* as count',
      );
    const totalPages = params.limit ? Math.max(meta.count / params.limit) : 1;
    const currentPage = params.page ?? 1;

    return {
      rows,
      meta: {
        totalPages,
        currentPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  }

  return rows;
}
