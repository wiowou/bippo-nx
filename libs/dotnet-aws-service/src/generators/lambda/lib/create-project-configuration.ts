import { ProjectConfiguration } from '@nx/devkit';
import { NormalizedLambdaGeneratorSchema } from '../schema';

export function createProjectConfiguration(normalizedOptions: NormalizedLambdaGeneratorSchema): ProjectConfiguration {
  return {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@bippo-nx/dotnet:lambda-package',
        options: {
          outputPath: `dist/${normalizedOptions.projectRoot}`,
        },
        configurations: {
          local: {
            fileReplacements: [
              {
                replace: `${normalizedOptions.projectRoot}/src/Environment.cs`,
                with: `${normalizedOptions.projectRoot}/environments/Environment.local.cs`,
              },
            ],
          },
          dev: {},
          prod: {
            fileReplacements: [
              {
                replace: `${normalizedOptions.projectRoot}/src/Environment.cs`,
                with: `${normalizedOptions.projectRoot}/environments/Environment.prod.cs`,
              },
            ],
          },
        },
      },
      tfinit: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}/terraform`,
          fileReplacements: [
            {
              replace: 'terraform.tfvars',
              with: 'environments/default.tfvars',
            },
            {
              replace: 'provider.tf',
              with: 'environments/provider.default.tf',
            },
          ],
          commands: ['terraform init'],
        },
        configurations: {
          local: {
            fileReplacements: [
              {
                replace: 'terraform.tfvars',
                with: 'environments/local.tfvars',
              },
              {
                replace: 'provider.tf',
                with: 'environments/provider.local.tf',
              },
            ],
          },
          prod: {
            fileReplacements: [
              {
                replace: 'terraform.tfvars',
                with: 'environments/prod.tfvars',
              },
              {
                replace: 'provider.tf',
                with: 'environments/provider.prod.tf',
              },
            ],
          },
        },
      },
      tfplan: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          fileReplacements: [
            {
              replace: 'terraform.tfvars',
              with: 'environments/dev.tfvars',
            },
            {
              replace: 'provider.tf',
              with: 'environments/provider.dev.tf',
            },
          ],
          commands: ['terraform plan -out=tfplan -input=false'],
        },
      },
      tfapply: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          fileReplacements: [
            {
              replace: 'terraform.tfvars',
              with: 'environments/dev.tfvars',
            },
            {
              replace: 'provider.tf',
              with: 'environments/provider.dev.tf',
            },
          ],
          commands: ['terraform apply -auto-approve tfplan'],
        },
      },
      tfdestroy: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          fileReplacements: [
            {
              replace: 'terraform.tfvars',
              with: 'environments/dev.tfvars',
            },
            {
              replace: 'provider.tf',
              with: 'environments/provider.dev.tf',
            },
          ],
          commands: ['terraform destroy -auto-approve tfplan'],
        },
      },
    },
  };
}
