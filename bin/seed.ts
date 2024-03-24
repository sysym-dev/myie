import 'dotenv/config';
import { program } from 'commander';
import { database } from '../src/core/database/database';
import path from 'path';
import { Knex } from 'knex';

const config: Knex.MigratorConfig = {
  directory: path.resolve(__dirname, '../src/database/seeders'),
  extension: 'ts',
};

program.command('make <name>').action(async (name: string) => {
  await database.seed.make(name, config);
});

program.command('run').action(async () => {
  await database.seed.run(config);

  process.exit(0);
});

program.parse();
