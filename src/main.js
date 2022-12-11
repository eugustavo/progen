import chalk from "chalk";
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from "util";
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';


const access = promisify(fs.access);
const copy = promisify(ncp);

function safeParseJson(str) {
  try {
    const maybeJson = JSON.parse(str);
    return maybeJson != null && typeof maybeJson == 'object' ? maybeJson : {};
  } catch (e) {
    return {};
  }
}

async function createDirectory(options) {
  const result = await execa('mkdir', [`${options.name}`]);

  if (result.failed) {
    return Promise.reject(new Error('Failed to create directory'));
  }

  return;
}

async function copyTemplateFiles(options) {
  return copy(options.templateDirectory, `${options.targetDirectory}/${options.name}`, {
    clobber: false,
  });
}

async function initializeGit(options) {
  const result = await execa('git', ['init'], {
    cwd: `${options.targetDirectory}/${options.name}`,
  });

  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }

  return;
}

async function configProject(options) {
  const packagePath = `${options.targetDirectory}/${options.name}/package.json`;
  const packageJSON = safeParseJson(fs.readFileSync(packagePath).toString());

  packageJSON.name = options.name;
  fs.writeFileSync(packagePath, JSON.stringify(packageJSON, null, 2));

  if (options.typeProject.toLowerCase() === 'expo') {
    const appJsonPath = `${options.targetDirectory}/${options.name}/app.json`;
    const appJSON = safeParseJson(fs.readFileSync(appJsonPath).toString());

    appJSON.name = options.name;
    appJSON.slug = options.name;
    fs.writeFileSync(appJsonPath, JSON.stringify(appJSON, null, 2));
  }

  return;
}

export async function createProject(options) {
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates',
    options.project.toLowerCase(),
    options.typeProject.toLowerCase()
  );
  options.templateDirectory = templateDir;

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Create directory',
      task: () => createDirectory(options),
    },
    {
      title: 'Generating project',
      task: () => copyTemplateFiles(options),
    },
    {
      title: 'Configuring project',
      task: () => configProject(options),
    },
    {
      title: 'Initialize git',
      task: () => initializeGit(options),
      skip: () =>
        !options.git
          ? 'Pass --git to automatically initialize git'
          : undefined,
    },
    {
      title: 'Install dependencies',
      task: () =>
        projectInstall({
          cwd: `${options.targetDirectory}/${options.name}`,
        }),
      skip: () =>
        !options.install
          ? 'Pass --install to automatically install dependencies'
          : undefined,
    }
  ]);

  await tasks.run();

  console.log(`%s ${chalk.green.bold('Your project is ready!')}\n`, chalk.green.bold('\n✅'));
  console.log(`%s To run your project, navigate to the directory and run one of the following npm commands.\n - ${chalk.white.bold(`cd ${options.name}`)}\n - ${chalk.white.bold(`npm start`)}`, chalk.green.bold('Next Steps 👇 \n'));
  return true;
}

