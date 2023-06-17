import { ProjectConfiguration } from '@nx/devkit';
import { NormalizedLambdaGeneratorSchema } from '../schema';

export function createProjectConfiguration(normalizedOptions: NormalizedLambdaGeneratorSchema): ProjectConfiguration {
  return {
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
}
