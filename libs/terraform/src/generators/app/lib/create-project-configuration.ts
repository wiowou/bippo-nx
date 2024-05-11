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
      tfinit: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          projectKey: `${normalizedOptions.parentProjectName}`,
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
      [normalizedOptions.appType === 'SHARED_INFRA' ? 'tfplan_1st' : 'tfplan']: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['terraform plan -out=tfplan -input=false'],
        },
      },
      [normalizedOptions.appType === 'SHARED_INFRA' ? 'tfapply_1st' : 'tfapply']: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['terraform apply -auto-approve tfplan'],
        },
      },
      [normalizedOptions.appType === 'SHARED_INFRA' ? 'tfdestroy_shared' : 'tfdestroy']: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['terraform destroy -auto-approve'],
        },
      },
    },
  };
}
