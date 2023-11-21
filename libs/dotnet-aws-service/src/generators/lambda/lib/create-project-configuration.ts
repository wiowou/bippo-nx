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
        },
        configurations: {
          local: {
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
      tfexec: {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: `${normalizedOptions.projectRoot}/terraform`,
          commands: [
            'cp environments/{args.environment}.tfvars terraform.tfvars',
            'cp environments/provider.{args.environment}.tf provider.tf',
            'terraform {args.cmd}',
          ],
        },
      },
      'init-local': {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: `${normalizedOptions.projectRoot}/terraform`,
          commands: [
            'cp environments/local.tfvars terraform.tfvars',
            'cp environments/provider.local.tf provider.tf',
            'terraform init',
          ],
        },
      },
      'plan-local': {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: `${normalizedOptions.projectRoot}/terraform`,
          commands: [
            'cp environments/local.tfvars terraform.tfvars',
            'cp environments/provider.local.tf provider.tf',
            'terraform plan -out=tfplan -input=false',
          ],
        },
      },
      'apply-local': {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: `${normalizedOptions.projectRoot}/terraform`,
          commands: [
            'cp environments/local.tfvars terraform.tfvars',
            'cp environments/provider.local.tf provider.tf',
            'terraform apply -auto-approve tfplan',
          ],
        },
      },
      'destroy-local': {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: `${normalizedOptions.projectRoot}/terraform`,
          commands: [
            'cp environments/local.tfvars terraform.tfvars',
            'cp environments/provider.local.tf provider.tf',
            'terraform destroy -auto-approve',
          ],
        },
      },
    },
  };
}
