import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import * as child_process from 'child_process';
import { Lambda1GeneratorSchema } from './schema';

import {
  terraformGenerator,
  TerraformGeneratorSchema,
} from '@bippo-nx/terraform';

interface NormalizedSchema extends Lambda1GeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  rootOffset: string;
  workspaceName: string;
  awsAccount: string;
}

function normalizeOptions(
  tree: Tree,
  options: Lambda1GeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const rootOffset = offsetFromRoot(projectRoot);
  const workspaceName = path.basename(tree.root);
  let stdout = ' not found';
  let awsAccount = '000000000000';
  try {
    stdout = child_process
      .execSync(`aws sts get-caller-identity --profile ${options.awsProfile}`)
      .toString();
    awsAccount = JSON.parse(stdout).Account;
  } catch (error) {
    console.log('could not determine aws account id');
  }

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    awsAccount,
    rootOffset,
    workspaceName,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (tree: Tree, options: Lambda1GeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const terraformGeneratorOptions: TerraformGeneratorSchema = {
    ...options,
    name: 'terraform',
    directory: options.name,
    appType: 'LAMBDA_SERVICE',
    database: options.database,
  };
  await terraformGenerator(tree, terraformGeneratorOptions);
  let projectConfiguration: any = {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@nrwl/webpack:webpack',
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'prod',
        options: {
          target: 'node',
          compiler: 'tsc',
          outputPath: `dist/apps/${normalizedOptions.projectName}`,
          main: `${normalizedOptions.projectRoot}/src/main.ts`,
          tsConfig: `${normalizedOptions.projectRoot}/tsconfig.app.json`,
          assets: [`${normalizedOptions.projectRoot}/src/assets`],
          isolatedConfig: true,
          webpackConfig: `${normalizedOptions.projectRoot}/webpack.config.js`,
        },
        configurations: {
          local: {
            fileReplacements: [
              {
                replace: `${normalizedOptions.projectRoot}/src/environments/environment.ts`,
                with: `${normalizedOptions.projectRoot}/src/environments/environment.local.ts`,
              },
            ],
          },
          dev: {},
          prod: {
            optimization: true,
            extractLicenses: true,
            inspect: false,
            externalDependencies: [
              'cache-manager',
              '@nestjs/websockets/socket-module',
              '@nestjs/microservices/microservices-module',
              '@nestjs/microservices',
              'fastify-swagger',
              'class-transformer/storage',
            ],
            fileReplacements: [
              {
                replace: `${normalizedOptions.projectRoot}/src/environments/environment.ts`,
                with: `${normalizedOptions.projectRoot}/src/environments/environment.prod.ts`,
              },
            ],
          },
        },
      },
      serve: {
        executor: '@nrwl/js:node',
        defaultConfiguration: 'dev',
        options: {
          buildTarget: `${normalizedOptions.projectName}:build`,
        },
        configurations: {
          local: {
            buildTarget: `${normalizedOptions.projectName}:build:local`,
          },
          dev: {
            buildTarget: `${normalizedOptions.projectName}:build:dev`,
          },
          prod: {
            buildTarget: `${normalizedOptions.projectName}:build:prod`,
          },
        },
      },
      lint: {
        executor: '@nrwl/linter:eslint',
        outputs: ['{options.outputFile}'],
        options: {
          lintFilePatterns: [`${normalizedOptions.projectRoot}/**/*.ts`],
        },
      },
      test: {
        executor: '@nrwl/jest:jest',
        outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
        options: {
          jestConfig: `${normalizedOptions.projectRoot}/jest.config.ts`,
          passWithNoTests: true,
        },
        configurations: {
          ci: {
            ci: true,
            codeCoverage: true,
          },
        },
      },
    },
  };
  if (options.database === 'dynamo') {
    projectConfiguration = {
      ...projectConfiguration,
      'create-ddbs': {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: './',
          commands: [
            'docker compose up -d',
            `aws dynamodb create-table --no-cli-pager --endpoint-url http://localhost:8112 --cli-input-yaml file://${normalizedOptions.projectRoot}/terraform/dynamodb/app-table.yaml --profile devopslocal`,
          ],
        },
      },
      'delete-ddbs': {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: './',
          commands: [
            'docker compose up -d',
            `aws dynamodb delete-table --no-cli-pager --endpoint-url http://localhost:8112 --table-name ${normalizedOptions.projectName} --profile devopslocal`,
          ],
        },
      },
    };
  }
  addProjectConfiguration(
    tree,
    normalizedOptions.projectName,
    projectConfiguration
  );
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
