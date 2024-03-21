import { program } from 'commander';
import { database } from '../src/core/database/database';
import path from 'path';

program.command('make <name>').action(async (name: string) => {
  await database.migrate.make(name, {
    directory: path.resolve(__dirname, '../src/database/migrations'),
    extension: 'ts',
  });
});

program.parse();
