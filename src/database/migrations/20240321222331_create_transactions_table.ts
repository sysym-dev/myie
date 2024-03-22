import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transactions', (table: Knex.TableBuilder) => {
    table.increments();
    table.decimal('amount', 10, 2).notNullable();
    table.enum('type', ['income', 'expense']).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('transactions');
}
