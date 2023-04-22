import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import * as child_process from 'child_process';
import { TerraformGeneratorSchema } from './schema';

interface NormalizedSchema extends TerraformGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  rootOffset: string;
  workspaceName: string;
  awsprofile: string;
  awsaccount: string;
}

function normalizeOptions(
  tree: Tree,
  options: TerraformGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  const awsprofile = options?.awsprofile || 'devopslocal';
  const rootOffset = offsetFromRoot(projectRoot);
  const workspaceName = path.basename(tree.root);
  let stdout = ' not found';
  let awsaccount = '000000000000';
  try {
    stdout = child_process
      .execSync(`aws sts get-caller-identity --profile ${awsprofile}`)
      .toString();
    awsaccount = JSON.parse(stdout).Account;
  } catch (error) {
    console.log('could not determine aws account id');
  }

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    awsaccount,
    awsprofile,
    rootOffset,
    workspaceName,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (tree: Tree, options: TerraformGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/terraform`,
    targets: {
      tfexec0: {
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
            'terraform plan -out=tfplan',
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
            'terraform apply tfplan',
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
            'terraform destroy',
          ],
        },
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
