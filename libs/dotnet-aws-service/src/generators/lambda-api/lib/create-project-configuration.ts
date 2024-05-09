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
          cwd: `${normalizedOptions.projectRoot}`,
          outputPath: `dist/${normalizedOptions.projectRoot}`,
          fileReplacements: [
            {
              replace: 'src/appsettings.json',
              with: 'environments/appsettings.default.json',
            },
          ],
        },
        configurations: {
          local: {
            fileReplacements: [
              {
                replace: 'src/appsettings.json',
                with: 'environments/appsettings.local.json',
              },
            ],
          },
          prod: {
            fileReplacements: [
              {
                replace: 'src/appsettings.json',
                with: 'environments/appsettings.prod.json',
              },
            ],
          },
        },
      },
      tfinit: {
        command: 'echo run tfinit',
        dependsOn: [
          {
            projects: [`${normalizedOptions.projectName}-tf`],
            target: 'tfinit',
            params: 'forward',
          },
        ],
      },
      tfplan: {
        command: 'echo run tfplan',
        dependsOn: [
          {
            projects: [`${normalizedOptions.projectName}-tf`],
            target: 'tfplan',
            params: 'forward',
          },
        ],
      },
      tfapply: {
        command: 'echo run tfapply',
        dependsOn: [
          {
            projects: [`${normalizedOptions.projectName}-tf`],
            target: 'tfapply',
            params: 'forward',
          },
        ],
      },
      tfdestroy: {
        command: 'echo run tfdestroy',
        dependsOn: [
          {
            projects: [`${normalizedOptions.projectName}-tf`],
            target: 'tfdestroy',
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
            `aws dynamodb create-table --no-cli-pager --endpoint-url http://localhost:8112 --cli-input-yaml file://${normalizedOptions.projectRoot}/terraform/dynamodb/app-table.yaml --profile ${normalizedOptions.awsProfile}`,
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
            `aws dynamodb delete-table --no-cli-pager --endpoint-url http://localhost:8112 --table-name ${normalizedOptions.projectName} --profile ${normalizedOptions.awsProfile}`,
          ],
        },
      },
    };
  }
  return projectConfiguration;
}
