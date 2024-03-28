import { database } from '../../core/database/database';
import { RecordNotFoundException } from '../../exceptions/record-not-found.exception';
import { User } from '../user/user';
import { TransactionCategory } from './transaction-category';

interface CreateTransactionCategoryData {
  name: string;
}

export async function findOrCreate(
  user: User,
  data: CreateTransactionCategoryData,
): Promise<TransactionCategory> {
  const category = await findTransactionCategoryByName(user, data.name);

  if (category) {
    return category;
  }

  return await createTransactionCategory(user, data);
}

export async function findTransactionCategory(
  user: User,
  id: TransactionCategory['id'],
): Promise<TransactionCategory> {
  const category = await database<TransactionCategory>('transaction_categories')
    .where('user_id', user.id)
    .where('id', id)
    .first();

  if (!category) {
    throw new RecordNotFoundException();
  }

  return category;
}

export async function findTransactionCategoryByName(
  user: User,
  name: string,
): Promise<TransactionCategory | undefined> {
  const category = await database<TransactionCategory>('transaction_categories')
    .where('user_id', user.id)
    .where('name', name)
    .first();

  return category;
}

export async function createTransactionCategory(
  user: User,
  data: CreateTransactionCategoryData,
): Promise<TransactionCategory> {
  const [id] = await database<TransactionCategory>(
    'transaction_categories',
  ).insert({
    name: data.name,
    user_id: user.id,
  });

  return await findTransactionCategory(user, id);
}
