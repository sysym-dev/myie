import inquirer from 'inquirer';
import { sources } from './sources';
import { Source } from './sources/source';

class Crawler {
  private source: Source;

  async start() {
    await this.selectSource();
    await this.processSource();
  }

  private async selectSource() {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'source',
        message: 'Select source',
        choices: Object.keys(sources),
      },
    ]);

    const source = sources[answer.source];

    this.source = new source();
  }

  private async processSource() {
    await this.source.start();
  }
}

new Crawler().start();
