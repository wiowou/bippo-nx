import * as child_process from 'child_process';
import { extractLayoutDirectory, Tree } from '@nx/devkit';
import { getWorkspaceLayout, joinPathFragments } from '@nx/devkit';
import { Linter } from '@nx/linter';

import type { PresetGeneratorSchema, NormalizedOptions } from '../schema';
import { TerraformGeneratorSchema } from '@bippo-nx/terraform';
import { v4 as uuidv4 } from '../../utils/uuid';

export function normalizeOptions(tree: Tree, options: PresetGeneratorSchema): NormalizedOptions {
  const { layoutDirectory, projectDirectory } = extractLayoutDirectory(options.directory);
  const appDirectory = projectDirectory ? `${projectDirectory}/${options.name}` : options.name;

  const appProjectRoot = options.rootProject
    ? '.'
    : joinPathFragments(layoutDirectory ?? getWorkspaceLayout(tree).appsDir, appDirectory);

  const solutionGuid = uuidv4().toUpperCase();

  const awsProfile = options.awsProfile;
  const terraformVersion = options.terraformVersion;
  const terraformAwsVersion = options.terraformAwsVersion;

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
    infraProjectName: options.infraProjectName ?? 'shared-infra',
    strict: options.strict ?? false,
    appProjectRoot,
    linter: options.linter ?? Linter.EsLint,
    unitTestRunner: options.unitTestRunner ?? 'jest',
    e2eTestRunner: options.e2eTestRunner ?? 'jest',
    solutionGuid,
    awsAccount,
    terraformVersion,
    terraformAwsVersion,
  };
}

export function toTerraformGeneratorOptions(options: NormalizedOptions): TerraformGeneratorSchema {
  return {
    name: 'terraform',
    directory: options.infraProjectName,
    awsProfile: options.awsProfile,
    database: options.database,
    appType: 'SHARED_INFRA',
    workspaceName: options.name,
  };
}
