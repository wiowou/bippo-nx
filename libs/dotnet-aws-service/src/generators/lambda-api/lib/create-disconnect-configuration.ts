import { ProjectConfiguration } from '@nx/devkit';
import { NormalizedLambdaApiGeneratorSchema } from '../schema';

export function createDisconnectConfiguration(
  normalizedOptions: NormalizedLambdaApiGeneratorSchema
): ProjectConfiguration {
  const projectConfiguration: ProjectConfiguration = {
    root: `${normalizedOptions.projectRoot}/disconnect`,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/disconnect`,
    targets: {
      build: {
        executor: '@bippo-nx/util:run-commands',
        options: {
          cwd: `${normalizedOptions.projectRoot}/disconnect`,
          commands: ['zip -r main.zip .'],
          copyInputFromPath: `${normalizedOptions.projectRoot}/disconnect/main.zip`,
          copyOutputToPath: `dist/${normalizedOptions.projectRoot}/disconnect`,
          removeInputPath: true,
        },
      },
    },
  };
  return projectConfiguration;
}
