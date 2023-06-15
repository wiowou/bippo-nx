import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import * as child_process from 'child_process';
import { TerraformGeneratorSchema } from './schema';
import * as versions from '../../utils/versions';

interface NormalizedSchema extends TerraformGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  rootOffset: string;
  localBuildOffset: string;
  workspaceName: string;
  awsAccount: string;
  applicationDirectory: string;
}

function normalizeOptions(tree: Tree, options: TerraformGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  // const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  // const projectName = name;
  const applicationDirectory = options.directory ? names(options.directory).fileName : name;
  const projectName = applicationDirectory.replace(new RegExp('/', 'g'), '-') + '-tf';
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const rootOffset = offsetFromRoot(projectRoot);
  const localBuildOffset = rootOffset.endsWith('/') ? rootOffset.substring(0, rootOffset.length - 1) : rootOffset;
  const workspaceName = path.basename(tree.root);
  const awsProfile = options.awsProfile || 'devopslocal';
  const terraformVersion = options.terraformAwsVersion || versions.terraformVersion;
  const terraformAwsVersion = options.terraformAwsVersion || versions.terraformAwsVersion;
  const appType = options.appType || 'SHARED_INFRA';
  const database = options.database || 'none';
  let stdout = ' not found';
  let awsAccount = '000000000000';
  try {
    stdout = child_process.execSync(`aws sts get-caller-identity --profile ${awsProfile}`).toString();
    awsAccount = JSON.parse(stdout).Account;
  } catch (error) {
    console.log('unable to determine aws account id.');
  }

  return {
    ...options,
    applicationDirectory,
    projectName,
    projectRoot,
    projectDirectory,
    awsAccount,
    awsProfile,
    localBuildOffset,
    rootOffset,
    workspaceName,
    terraformVersion,
    terraformAwsVersion,
    appType,
    database,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema, target = 'files') {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, target), options.projectRoot, templateOptions);
}

export default async function (tree: Tree, options: TerraformGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
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
  });
  addFiles(tree, normalizedOptions);
  if (options.database === 'dynamo') {
    addFiles(tree, normalizedOptions, 'dynamo-files');
  }
  await formatFiles(tree);
}
