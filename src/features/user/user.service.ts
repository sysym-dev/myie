import { Knex } from 'knex';
import { database } from '../../core/database/database';
import { User } from './user';

export async function updateBalance(
  user: User,
  data: {
    type: 'income' | 'expense';
    amount: number;
  },
  options: {
    transaction: Knex.Transaction;
  },
) {
  const query = database('users').where('id', user.id);

  data.type === 'income'
    ? query.increment('balance', data.amount)
    : query.decrement('balance', data.amount);

  await query.transacting(options.transaction);
}
