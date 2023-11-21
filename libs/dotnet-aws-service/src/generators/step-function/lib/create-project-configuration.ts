import { NormalizedStepFunctionGeneratorSchema } from '../schema';
import { ProjectConfiguration } from '@nx/devkit';

export function createProjectConfiguration(
  normalizedOptions: NormalizedStepFunctionGeneratorSchema
): ProjectConfiguration {
  return {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}`,
    targets: {
      tfexec: {
        command: 'echo run tfexec',
        dependsOn: [
          {
            projects: [`${normalizedOptions.projectName}-tf`],
            target: 'tfexec',
            params: 'forward',
          },
          {
            projects: [],
            target: 'build',
            params: 'ignore',
          },
        ],
      },
      build: {
        command: 'echo run build',
        dependsOn: [
          {
            projects: [],
            target: 'build',
            params: 'forward',
          },
        ],
      },
    },
  };
}
