import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.integer('category_id').unsigned().nullable().after('user_id');
    table.foreign('category_id').references('transaction_categories.id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.dropForeign('category_id');
    table.dropColumn('category_id');
  });
}
