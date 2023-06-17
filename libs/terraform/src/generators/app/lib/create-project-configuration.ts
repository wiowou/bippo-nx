import { NormalizedTerraformGeneratorSchema } from '../schema';
import { ProjectConfiguration } from '@nx/devkit';

export function createProjectConfiguration(
  normalizedOptions: NormalizedTerraformGeneratorSchema
): ProjectConfiguration {
  return {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}`,
    targets: {
      tfexec: {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: `${normalizedOptions.projectRoot}`,
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
          cwd: `${normalizedOptions.projectRoot}`,
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
          cwd: `${normalizedOptions.projectRoot}`,
          commands: [
            'cp environments/local.tfvars terraform.tfvars',
            'cp environments/provider.local.tf provider.tf',
            'terraform plan -out=tfplan',
          ],
        },
      },
      'apply-local': {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: `${normalizedOptions.projectRoot}`,
          commands: [
            'cp environments/local.tfvars terraform.tfvars',
            'cp environments/provider.local.tf provider.tf',
            'terraform apply tfplan',
          ],
        },
      },
      'destroy-local': {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: `${normalizedOptions.projectRoot}`,
          commands: [
            'cp environments/local.tfvars terraform.tfvars',
            'cp environments/provider.local.tf provider.tf',
            'terraform destroy',
          ],
        },
      },
    },
  };
}
