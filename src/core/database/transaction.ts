import { Knex } from 'knex';

export type WithTransaction = {
  transaction?: Knex.Transaction;
};
