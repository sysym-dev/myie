import { z } from 'zod';
import { database } from '../../core/database/database';
import { updateBalance } from '../user/user.service';
import { User } from '../user/user';
import { findOrCreate } from '../transaction-category/transaction-category.service';
import { TransactionCategory } from '../transaction-category/transaction-category';

type TransactionType = 'income' | 'expense';
interface Transaction {
  amount: number;
  type: TransactionType;
  user_id: User['id'];
  category_id: TransactionCategory['id'];
}
interface CreateTransactionData {
  amount: number;
  type: TransactionType;
  category?: string;
  category_id?: TransactionCategory['id'];
}
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
  user: User,
  data: CreateTransactionData,
): Promise<void> {
  await database.transaction(async (dbTransaction) => {
    if (data.category) {
      const category = await findOrCreate(user, { name: data.category });

      data.category_id = category.id;
    }

    const transaction = await database<Transaction>('transactions')
      .insert({
        amount: data.amount,
        type: data.type,
        category_id: data.category_id,
        user_id: user.id,
      })
      .transacting(dbTransaction);

    await updateBalance(
      user,
      { amount: data.amount, type: data.type },
      { transaction: dbTransaction },
    );

    return transaction;
  });
}

export async function readTransactions(params?: {
  start_at?: Date;
  end_at?: Date;
  sort?: {
    column: 'created_at';
    direction: 'asc' | 'desc';
  };
  paginated?: boolean;
  limit?: number;
  page?: number;
  user_id?: User['id'];
}): Promise<Transaction[] | Paginated<Transaction>> {
  const query = database<Transaction>('transactions');

  if (params?.start_at) {
    query.where('created_at', '>=', params.start_at);
  }

  if (params?.end_at) {
    query.where('created_at', '<=', params.end_at);
  }

  if (params?.user_id) {
    query.where('user_id', params.user_id);
  }

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
    const countQuery = database('transactions');

    if (params?.start_at) {
      countQuery.where('created_at', '>=', params.start_at);
    }

    if (params?.end_at) {
      countQuery.where('created_at', '<=', params.end_at);
    }

    const [meta] =
      await countQuery.count<[Record<'count', number>]>('* as count');

    const totalPages = params.limit ? Math.ceil(meta.count / params.limit) : 1;
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
