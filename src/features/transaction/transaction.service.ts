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
interface TransactionFilter {
  start_at?: Date;
  end_at?: Date;
}
interface Paginated<T, M = {}> {
  rows: T[];
  meta: M & {
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
      const category = await findOrCreate(
        user,
        { name: data.category },
        { transaction: dbTransaction },
      );

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

export async function readTransactions(
  user: User,
  params?: TransactionFilter & {
    sort?: {
      column: 'created_at';
      direction: 'asc' | 'desc';
    };
    paginated?: boolean;
    limit?: number;
    page?: number;
  },
): Promise<
  Transaction[] | Paginated<Transaction, { income: number; expense: number }>
> {
  const query = database<Transaction>('transactions').where(
    'transactions.user_id',
    user.id,
  );

  if (params?.start_at) {
    query.where('created_at', '>=', params.start_at);
  }

  if (params?.end_at) {
    query.where('created_at', '<=', params.end_at);
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

  const rows = await query
    .leftJoin(
      'transaction_categories',
      'transactions.category_id',
      'transaction_categories.id',
    )
    .select(
      'transactions.id as id',
      'transactions.type as type',
      'transactions.amount as amount',
      'transactions.created_at as created_at',
      'transaction_categories.name as category_name',
    );

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

    const { income, expense } = await getUserStats(user, {
      start_at: params.start_at,
      end_at: params.end_at,
    });

    return {
      rows,
      meta: {
        income,
        expense,
        totalPages,
        currentPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  }

  return rows;
}

export async function getUserStats(
  user: User,
  params?: TransactionFilter,
): Promise<{
  income: number;
  expense: number;
}> {
  const query = database('transactions')
    .where('user_id', user.id)
    .groupBy('type');

  if (params?.start_at) {
    query.where('created_at', '>=', params.start_at);
  }

  if (params?.end_at) {
    query.where('created_at', '<=', params.end_at);
  }

  const stats = await query.select(
    'type',
    database.raw('sum(amount) as amount'),
  );

  if (!stats.length) {
    return {
      income: 0,
      expense: 0,
    };
  }

  const [income, expense] = stats;

  return {
    income: income?.amount ?? 0,
    expense: expense?.amount ?? 0,
  };
}
