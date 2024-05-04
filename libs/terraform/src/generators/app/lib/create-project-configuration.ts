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
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          fileReplacements: [
            {
              replace: 'terraform.tfvars',
              with: 'environments/{args.environment}.tfvars',
            },
            {
              replace: 'provider.tf',
              with: 'environments/provider.{args.environment}.tf',
            },
          ],
          commands: ['terraform {args.cmd}'],
        },
      },
      'init-local': {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
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
          commands: ['terraform init'],
        },
      },
      'plan-local': {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['terraform plan -out=tfplan -input=false'],
        },
      },
      'apply-local': {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['terraform apply -auto-approve tfplan'],
        },
      },
      'destroy-local': {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['terraform destroy -auto-approve'],
        },
      },
    },
  };
}
