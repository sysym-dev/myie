import inquirer from 'inquirer';

async function start() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'source',
      message: 'Select source',
      choices: ['Kemenag', 'Tanzil', 'Save'],
    },
  ]);

  console.log(answers);
}

start();
