import 'dotenv/config';
import { program } from 'commander';
import { database } from '../src/core/database/database';
import path from 'path';
import { Knex } from 'knex';

const config: Knex.MigratorConfig = {
  directory: path.resolve(__dirname, '../src/database/migrations'),
  extension: 'ts',
};

program.command('make <name>').action(async (name: string) => {
  await database.migrate.make(name, config);
});

program.command('migrate').action(async () => {
  await database.migrate.latest(config);

  process.exit(0);
});

program.parse();
