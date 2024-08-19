import { ProjectConfiguration } from '@nx/devkit';
import { NormalizedLambdaApiGeneratorSchema } from '../schema';

export function createConnectConfiguration(
  normalizedOptions: NormalizedLambdaApiGeneratorSchema
): ProjectConfiguration {
  const projectConfiguration: ProjectConfiguration = {
    root: `${normalizedOptions.projectRoot}/connect`,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/connect`,
    targets: {
      build: {
        executor: '@bippo-nx/util:run-commands',
        options: {
          cwd: `${normalizedOptions.projectRoot}/connect`,
          commands: ['zip -r main.zip .'],
          copyInputFromPath: `${normalizedOptions.projectRoot}/connect/main.zip`,
          copyOutputToPath: `dist/${normalizedOptions.projectRoot}/connect`,
          removeInputPath: true,
        },
      },
    },
  };
  return projectConfiguration;
}
