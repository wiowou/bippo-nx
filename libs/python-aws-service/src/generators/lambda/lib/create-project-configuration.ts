import { ProjectConfiguration, ProjectType } from '@nx/devkit';
import { NormalizedLambdaGeneratorSchema } from '../schema';

export function createProjectConfiguration(normalizedOptions: NormalizedLambdaGeneratorSchema): ProjectConfiguration {
  var config = {
    root: normalizedOptions.projectRoot,
    projectType: 'application' as ProjectType,
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@bippo-nx/util:run-commands',
        options: {
          cwd: `${normalizedOptions.projectRoot}/src`,
          fileReplacements: [
            {
              replace: 'environment.py',
              with: '../environments/environment.default.py',
            },
          ],
          commands: ['pip install -r requirements.txt -t .', 'zip -r main.zip .'],
          copyInputFromPath: `${normalizedOptions.projectRoot}/src/main.zip`,
          copyOutputToPath: `dist/${normalizedOptions.projectRoot}`,
          removeInputPath: true,
        },
        configurations: {
          local: {
            fileReplacements: [
              {
                replace: 'src/environment.py',
                with: '../environments/environment.local.py',
              },
            ],
          },
          prod: {
            fileReplacements: [
              {
                replace: 'src/environment.py',
                with: '../environments/environment.prod.py',
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
