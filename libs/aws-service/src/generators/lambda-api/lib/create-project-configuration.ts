import { ProjectConfiguration } from '@nx/devkit';
import { NormalizedLambdaApiGeneratorSchema } from '../schema';

export function createProjectConfiguration(
  normalizedOptions: NormalizedLambdaApiGeneratorSchema
): ProjectConfiguration {
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
          generatePackageJson: true,
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
      tfexec: {
        command: 'echo run tfexec',
        dependsOn: [
          {
            projects: [`${normalizedOptions.projectName}-tf`],
            target: 'tfexec',
            params: 'forward',
          },
        ],
      },
    },
  };
  if (normalizedOptions.database === 'dynamo') {
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
  return projectConfiguration;
}
