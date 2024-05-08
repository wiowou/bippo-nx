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
      tfinit: {
        command: 'echo run tfinit',
        dependsOn: [
          {
            projects: [`${normalizedOptions.projectName}-tf`],
            target: 'tfinit',
            params: 'forward',
          },
          {
            projects: [],
            target: 'build',
            params: 'ignore',
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
          {
            projects: [],
            target: 'build',
            params: 'ignore',
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
          {
            projects: [],
            target: 'build',
            params: 'ignore',
          },
        ],
      },
    },
  };
}
