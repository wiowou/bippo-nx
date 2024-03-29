import { ProjectConfiguration } from '@nx/devkit';
import { NormalizedLibGeneratorSchema } from '../schema';

export function createProjectConfiguration(normalizedOptions: NormalizedLibGeneratorSchema): ProjectConfiguration {
  return {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}`,
    targets: {
      build: {
        command: 'echo run lib-build',
      },
    },
  };
}
