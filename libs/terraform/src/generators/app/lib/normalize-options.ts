import { getWorkspaceLayout, names, offsetFromRoot, Tree } from '@nx/devkit';
import * as path from 'path';
import * as child_process from 'child_process';
import { NormalizedTerraformGeneratorSchema, TerraformGeneratorSchema } from '../schema';
import * as versions from '../../../utils/versions';

export function normalizeOptions(tree: Tree, options: TerraformGeneratorSchema): NormalizedTerraformGeneratorSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  // const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  // const projectName = name;
  const applicationDirectory = options.directory ? names(options.directory).fileName : name;
  const parentProjectName = applicationDirectory.replace(new RegExp('/', 'g'), '-');
  const projectName = parentProjectName + '-tf';
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const rootOffset = offsetFromRoot(projectRoot);
  const localBuildOffset = rootOffset.endsWith('/') ? rootOffset.substring(0, rootOffset.length - 1) : rootOffset;
  const workspaceName = path.basename(tree.root);
  const awsProfile = options.awsProfile;
  const terraformVersion = options.terraformVersion || versions.terraformVersion;
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
    parentProjectName,
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
