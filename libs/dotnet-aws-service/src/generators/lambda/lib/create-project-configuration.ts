import { ProjectConfiguration } from '@nx/devkit';
import { NormalizedLambdaGeneratorSchema } from '../schema';

export function createProjectConfiguration(normalizedOptions: NormalizedLambdaGeneratorSchema): ProjectConfiguration {
  return {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}`,
    targets: {
      dotnetexec: {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['cp environments/{args.environment}.cs environments/environment.cs', 'dotnet {args.cmd}'],
        },
      },
    },
  };
}
