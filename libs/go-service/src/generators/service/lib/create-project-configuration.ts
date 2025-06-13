import { ProjectConfiguration, ProjectType } from '@nx/devkit';
import { NormalizedServiceGeneratorSchema } from '../schema';

export function createProjectConfiguration(normalizedOptions: NormalizedServiceGeneratorSchema): ProjectConfiguration {
  const config = {
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
              replace: 'environment.go',
              with: '../environments/environment.default.go',
            },
          ],
          commands: ['go mod tidy', 'go build -o main.exe'],
          copyInputFromPath: `${normalizedOptions.projectRoot}/src/main.exe`,
          copyOutputToPath: `dist/${normalizedOptions.projectRoot}`,
          removeInputPath: true,
        },
        configurations: {
          local: {
            fileReplacements: [
              {
                replace: 'environment.go',
                with: '../environments/environment.local.go',
              },
            ],
          },
          prod: {
            fileReplacements: [
              {
                replace: 'environment.go',
                with: '../environments/environment.prod.go',
              },
            ],
          },
        },
      },
      run: {
        executor: '@bippo-nx/util:run-commands',
        options: {
          cwd: `${normalizedOptions.projectRoot}/src`,
          fileReplacements: [
            {
              replace: 'environment.go',
              with: '../environments/environment.default.go',
            },
          ],
          commands: ['go mod tidy', `go run ${normalizedOptions.projectName}`],
        },
        configurations: {
          local: {
            fileReplacements: [
              {
                replace: 'environment.go',
                with: '../environments/environment.local.go',
              },
            ],
          },
          prod: {
            fileReplacements: [
              {
                replace: 'environment.go',
                with: '../environments/environment.prod.go',
              },
            ],
          },
        },
      },
    },
  };
  return config;
}
