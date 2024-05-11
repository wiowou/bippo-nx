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
          commands: ['terraform plan -out=tfplan -input=false'],
        },
      },
      tfapply: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['terraform apply -auto-approve tfplan'],
        },
      },
      tfdestroy: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['terraform destroy -auto-approve'],
        },
      },
    },
  };
}
