import { database } from '../../core/database/database';
import { User } from './user';
import { RecordNotFoundException } from '../../exceptions/record-not-found.exception';
import { WithTransaction } from '../../core/database/transaction';

export async function updateBalance(
  user: User,
  data: {
    type: 'income' | 'expense';
    amount: number;
  },
  options: Required<WithTransaction>,
) {
  const query = database('users').where('id', user.id);

  data.type === 'income'
    ? query.increment('balance', data.amount)
    : query.decrement('balance', data.amount);

  await query.transacting(options.transaction);
}

export async function findById(id: User['id']): Promise<User> {
  const user = await database<User>('users').where('id', id).first();

  if (!user) {
    throw new RecordNotFoundException();
  }

  return user;
}

export async function findByEmail(email: User['email']): Promise<User> {
  const user = await database<User>('users').where('email', email).first();

  if (!user) {
    throw new RecordNotFoundException();
  }

  return user;
}
