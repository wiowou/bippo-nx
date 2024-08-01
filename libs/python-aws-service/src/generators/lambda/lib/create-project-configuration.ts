import { ProjectConfiguration } from '@nx/devkit';
import { NormalizedLambdaGeneratorSchema } from '../schema';

export function createProjectConfiguration(normalizedOptions: NormalizedLambdaGeneratorSchema): ProjectConfiguration {
  return {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
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
