import { NormalizedTerraformGeneratorSchema } from '../schema';
import { ProjectConfiguration } from '@nx/devkit';

export function createProjectConfiguration(
  normalizedOptions: NormalizedTerraformGeneratorSchema
): ProjectConfiguration {
  const tfdestroy = {
    executor: '@bippo-nx/terraform:tfexec',
    options: {
      cwd: `${normalizedOptions.projectRoot}`,
      commands: ['terraform destroy -auto-approve'],
    },
  };
  return {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}`,
    targets: {
      tfinit: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          fileReplacements: [
            {
              replace: 'terraform.tfvars',
              with: 'environments/default.tfvars',
            },
            {
              replace: 'provider.tf',
              with: `${normalizedOptions.rootOffset}terraform-providers/provider.default.tf`,
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
                with: `${normalizedOptions.rootOffset}terraform-providers/provider.local.tf`,
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
                with: `${normalizedOptions.rootOffset}terraform-providers/provider.prod.tf`,
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
      tfdestroy: normalizedOptions.appType === 'SHARED_INFRA' ? tfdestroy : undefined,
    },
  };
}
