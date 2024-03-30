import { Knex } from 'knex';
import { database } from '../../core/database/database';
import { RecordNotFoundException } from '../../exceptions/record-not-found.exception';
import { User } from '../user/user';
import { TransactionCategory } from './transaction-category';
import { WithTransaction } from '../../core/database/transaction';

interface CreateTransactionCategoryData {
  name: string;
}

export async function findOrCreate(
  user: User,
  data: CreateTransactionCategoryData,
  options?: WithTransaction,
): Promise<TransactionCategory> {
  const category = await findTransactionCategoryByName(
    user,
    data.name,
    options,
  );

  if (category) {
    return category;
  }

  return await createTransactionCategory(user, data, options);
}

export async function findTransactionCategory(
  user: User,
  id: TransactionCategory['id'],
  options?: WithTransaction,
): Promise<TransactionCategory> {
  const query = database<TransactionCategory>('transaction_categories')
    .where('user_id', user.id)
    .where('id', id);

  const category = options?.transaction
    ? await query.transacting(options.transaction).first()
    : await query.first();

  if (!category) {
    throw new RecordNotFoundException();
  }

  return category;
}

export async function findTransactionCategoryByName(
  user: User,
  name: string,
  options?: WithTransaction,
): Promise<TransactionCategory | undefined> {
  const query = database<TransactionCategory>('transaction_categories')
    .where('user_id', user.id)
    .where('name', name);

  return options?.transaction
    ? await query.transacting(options.transaction).first()
    : await query.first();
}

export async function createTransactionCategory(
  user: User,
  data: CreateTransactionCategoryData,
  options?: WithTransaction,
): Promise<TransactionCategory> {
  const query = database<TransactionCategory>('transaction_categories');

  const [id] = options?.transaction
    ? await query.transacting(options.transaction).insert({
        name: data.name,
        user_id: user.id,
      })
    : await query.insert({
        name: data.name,
        user_id: user.id,
      });

  return await findTransactionCategory(user, id, options);
}
