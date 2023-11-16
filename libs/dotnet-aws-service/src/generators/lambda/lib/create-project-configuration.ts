import { ProjectConfiguration } from '@nx/devkit';
import { NormalizedLambdaGeneratorSchema } from '../schema';

export function createProjectConfiguration(normalizedOptions: NormalizedLambdaGeneratorSchema): ProjectConfiguration {
  return {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src/${normalizedOptions.functionName}`,
    targets: {
      build: {
        executor: '@bippo-nx/dotnet:lambda-package',
        options: {
          outputPath: `dist/${normalizedOptions.projectRoot}`,
          dotnetRootPath: '',
          dotnetToolsPath: '',
        },
        configurations: {
          local: {
            dotnetRootPath: '',
            dotnetToolsPath: '',
            fileReplacements: [
              {
                replace: `${normalizedOptions.projectRoot}/src/${normalizedOptions.functionName}/Environment.cs`,
                with: `${normalizedOptions.projectRoot}/src/environments/Environment.local.cs`,
              },
            ],
          },
          dev: {},
          prod: {
            fileReplacements: [
              {
                replace: `${normalizedOptions.projectRoot}/src/${normalizedOptions.functionName}/Environment.cs`,
                with: `${normalizedOptions.projectRoot}/src/environments/Environment.prod.cs`,
              },
            ],
          },
        },
      },
    },
  };
}
