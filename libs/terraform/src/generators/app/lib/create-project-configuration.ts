import { NormalizedTerraformGeneratorSchema } from '../schema';
import { ProjectConfiguration } from '@nx/devkit';

export function createProjectConfiguration(
  normalizedOptions: NormalizedTerraformGeneratorSchema
): ProjectConfiguration {
  let tfplan = 'tfplan';
  let tfapply = 'tfapply';
  let tfdestroy = 'tfdestroy';
  if (normalizedOptions.appType === 'SHARED_INFRA') {
    tfplan = 'tfplan_1st';
    tfapply = 'tfapply_1st';
    tfdestroy = 'tfdestroy_shared';
  } else if (normalizedOptions.appType === 'LAMBDA') {
    tfplan = 'tfplan_2nd';
    tfapply = 'tfapply_2nd';
  }
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
              with: `${normalizedOptions.rootOffset}terraform-providers/provider.${
                normalizedOptions.appType === 'SHARED_INFRA' ? 'shared-infra.nprd' : 'default'
              }.tf`,
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
                with: `${normalizedOptions.rootOffset}terraform-providers/provider.${
                  normalizedOptions.appType === 'SHARED_INFRA' ? 'shared-infra.prod' : 'prod'
                }.tf`,
              },
            ],
          },
        },
      },
      [tfplan]: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['terraform plan -out=tfplan -input=false'],
        },
      },
      [tfapply]: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['terraform apply -auto-approve tfplan'],
        },
      },
      [tfdestroy]: {
        executor: '@bippo-nx/terraform:tfexec',
        options: {
          cwd: `${normalizedOptions.projectRoot}`,
          commands: ['terraform destroy -auto-approve'],
        },
      },
    },
  };
}
