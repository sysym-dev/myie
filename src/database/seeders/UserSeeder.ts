import { Knex } from 'knex';
import { User } from '../../features/user/user';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('users').del();

  // Inserts seed entries
  await knex<User>('users').insert({});
}
