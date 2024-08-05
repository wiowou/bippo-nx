import { ProjectConfiguration, ProjectType } from '@nx/devkit';
import { NormalizedLambdaGeneratorSchema } from '../schema';

export function createProjectConfiguration(normalizedOptions: NormalizedLambdaGeneratorSchema): ProjectConfiguration {
  var config = {
    root: normalizedOptions.projectRoot,
    projectType: 'application' as ProjectType,
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@bippo-nx/dotnet:lambda-package',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          outputPath: `dist/${normalizedOptions.projectRoot}`,
          fileReplacements: [
            {
              replace: 'src/Environment.cs',
              with: 'environments/Environment.default.cs',
            },
          ],
        },
        configurations: {
          local: {
            fileReplacements: [
              {
                replace: 'src/Environment.cs',
                with: 'environments/Environment.local.cs',
              },
            ],
          },
          prod: {
            fileReplacements: [
              {
                replace: 'src/Environment.cs',
                with: 'environments/Environment.prod.cs',
              },
            ],
          },
          tfdestroy: {
            emptyZip: true,
          },
        },
      },
    },
  };
  var terraformConfig = {
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
  };
  if (normalizedOptions.generateTerraform) {
    return {
      ...config,
      ...terraformConfig,
    };
  }
  return config;
}
