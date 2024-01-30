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
        executor: '@bippo-nx/dotnet:lambda-package',
        options: {
          outputPath: `dist/${normalizedOptions.projectRoot}`,
        },
        configurations: {
          local: {},
          dev: {},
          prod: {},
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
