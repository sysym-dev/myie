import { Knex } from 'knex';
import { User } from '../../features/user/user';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex<User>('users').insert({
    email: 'test@email.com',
    password: await bcrypt.hash('password', 10),
  });
}
