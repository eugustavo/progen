import arg from 'arg'
import inquirer from 'inquirer'

import { createProject } from './main'

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--name': Boolean,
      '-n': '--name',

      '--project': Boolean,
      '-p': '--project',

      '--type-project': Boolean,
      '-t': '--type-project',

      '--git': Boolean,
      '-g': '--git',

      '--install': Boolean,
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(2),
    }
  )
  return {
    name: args['--name'] || false,

    project: args['--project'] || false,
    typeProject: args['--type-project'] || false,

    git: args['--git'] || false,

    install: args['--install'] || false,
  }
};

async function promptForMissingOptions(options) {
  const whatProject = [];
  const questions = [];
  const projectName = [];

  let typeProjectChoices;

  if (!options.name) {
    projectName.push({
      type: 'input',
      name: 'name',
      message: 'What name do you want to give your project?',
      default: 'my-project',
    })
  }

  const choiceProjectName = await inquirer.prompt(projectName);

  if (!options.project) {
    whatProject.push({
      type: 'list',
      name: 'project',
      message: 'Please choose one of the platforms',
      choices: ['React', 'React Native', 'NodeJS'],
      default: 'React',
    })
  }

  const choiceProject = await inquirer.prompt(whatProject);

  switch (choiceProject.project) {
    case 'React':
      typeProjectChoices = ['Next', 'Vite', 'CRA'];
      break;
    case 'React Native':
      typeProjectChoices = ['Expo', 'CLI'];
      break;
    case 'NodeJS':
      typeProjectChoices = ['NestJS', 'ExpressJS'];
      break;
    default:
      break;
  }

  if (!options.typeProject) {
    questions.push({
      type: 'list',
      name: 'typeProject',
      message: 'Please choose one of the frameworks',
      choices: typeProjectChoices,
      default: typeProjectChoices[0],
    })
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize a git repository?',
      default: 'false',
    })
  }

  if (!options.install) {
    questions.push({
      type: 'confirm',
      name: 'install',
      message: 'Install dependencies?',
      default: 'false',
    })
  }

  const answers = await inquirer.prompt(questions)

  return {
    ...options,
    name: options.name || choiceProjectName.name,
    project: options.project || choiceProject.project,
    typeProject: options.typeProject || answers.typeProject,
    git: options.git || answers.git,
    install: options.install || answers.install,
  }
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args)
  options = await promptForMissingOptions(options)
  await createProject(options)
}