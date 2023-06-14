import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  ProjectConfiguration,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { LambdaGeneratorSchema } from './schema';

import { terraformGenerator, TerraformGeneratorSchema } from '@bippo-nx/terraform';

interface NormalizedSchema extends LambdaGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  rootOffset: string;
  workspaceName: string;
}

function normalizeOptions(tree: Tree, options: LambdaGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const rootOffset = offsetFromRoot(projectRoot);
  const workspaceName = path.basename(tree.root);

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
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
  generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

export default async function (tree: Tree, options: LambdaGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  if (options.generateTerraform) {
    const terraformGeneratorOptions: TerraformGeneratorSchema = {
      ...options,
      name: 'terraform',
      directory: normalizedOptions.projectDirectory,
      appType: 'LAMBDA',
      database: options.database,
    };
    await terraformGenerator(tree, terraformGeneratorOptions);
  }

  const projectConfiguration: ProjectConfiguration = {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@nx/webpack:webpack',
        outputs: ['{options.outputPath}'],
        defaultConfiguration: 'prod',
        options: {
          target: 'node',
          compiler: 'tsc',
          outputPath: `dist/${normalizedOptions.projectRoot}`,
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
        executor: '@nx/js:node',
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
        executor: '@nx/linter:eslint',
        outputs: ['{options.outputFile}'],
        options: {
          lintFilePatterns: [`${normalizedOptions.projectRoot}/**/*.ts`],
        },
      },
      test: {
        executor: '@nx/jest:jest',
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
  if (options.database === 'dynamo' && options.generateTerraform) {
    projectConfiguration.targets = {
      ...projectConfiguration.targets,
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
  addProjectConfiguration(tree, normalizedOptions.projectName, projectConfiguration);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
