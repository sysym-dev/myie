import { database } from '../../core/database/database';
import { User } from './user';
import { RecordNotFoundException } from '../../exceptions/record-not-found.exception';
import { WithTransaction } from '../../core/database/transaction';
import bcrypt from 'bcrypt'
import { DuplicateEntryException } from '../../exceptions/duplicate-entry.exception';
import { Count } from '../../core/database/count';

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

export async function newUser(credential: {
  email: User['email'],
  password: User['password']
}): Promise<User> {
  if (await checkIsEmailExists(credential.email)) {
    throw new DuplicateEntryException('email already exists')
  }

  const [id] = await database<User>('users').insert({
    email: credential.email,
    password: await bcrypt.hash(credential.password, 10)
  })

  return await findById(id)
}

export async function checkIsEmailExists(email: string): Promise<boolean> {
  const [count] =
    await database('users').where('email', email).count<Count>('* as count');

  return !!count.count
}