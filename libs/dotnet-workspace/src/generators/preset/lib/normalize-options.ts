import { extractLayoutDirectory, Tree } from '@nx/devkit';
import { getWorkspaceLayout, joinPathFragments, names } from '@nx/devkit';
import { Linter } from '@nx/linter';
import * as path from 'path';

import type { PresetGeneratorSchema, NormalizedOptions } from '../schema';
import { TerraformGeneratorSchema } from '@bippo-nx/terraform';
import { v4 as uuidv4 } from '../../utils/uuid';
import * as changeCase from '../../utils/change-case';

export function normalizeOptions(tree: Tree, options: PresetGeneratorSchema): NormalizedOptions {
  const { layoutDirectory, projectDirectory } = extractLayoutDirectory(options.directory);

  // const appDirectory = projectDirectory
  //   ? `${names(projectDirectory).fileName}/${names(options.name).fileName}`
  //   : names(options.name).fileName;
  const appDirectory = projectDirectory ? `${projectDirectory}/${options.name}` : options.name;

  const appProjectRoot = options.rootProject
    ? '.'
    : joinPathFragments(layoutDirectory ?? getWorkspaceLayout(tree).appsDir, appDirectory);

  const solutionGuid = uuidv4().toUpperCase();
  tree.root = options.name;
  return {
    ...options,
    infraProjectName: options.infraProjectName ?? 'shared-infra',
    strict: options.strict ?? false,
    appProjectRoot,
    linter: options.linter ?? Linter.EsLint,
    unitTestRunner: options.unitTestRunner ?? 'jest',
    e2eTestRunner: options.e2eTestRunner ?? 'jest',
    solutionGuid,
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
