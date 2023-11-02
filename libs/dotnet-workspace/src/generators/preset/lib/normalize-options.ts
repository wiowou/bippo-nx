import { extractLayoutDirectory, Tree } from '@nx/devkit';
import { getWorkspaceLayout, joinPathFragments, names } from '@nx/devkit';
import { Linter } from '@nx/linter';

import type { PresetGeneratorSchema, NormalizedOptions } from '../schema';
import { TerraformGeneratorSchema } from '@bippo-nx/terraform';

export function normalizeOptions(tree: Tree, options: PresetGeneratorSchema): NormalizedOptions {
  const { layoutDirectory, projectDirectory } = extractLayoutDirectory(options.directory);

  const appDirectory = projectDirectory
    ? `${names(projectDirectory).fileName}/${names(options.name).fileName}`
    : names(options.name).fileName;

  const appProjectRoot = options.rootProject
    ? '.'
    : joinPathFragments(layoutDirectory ?? getWorkspaceLayout(tree).appsDir, appDirectory);

  return {
    ...options,
    infraProjectName: options.infraProjectName ?? 'shared-infra',
    strict: options.strict ?? false,
    appProjectRoot,
    linter: options.linter ?? Linter.EsLint,
    unitTestRunner: options.unitTestRunner ?? 'jest',
    e2eTestRunner: options.e2eTestRunner ?? 'jest',
  };
}

export function toTerraformGeneratorOptions(options: NormalizedOptions): TerraformGeneratorSchema {
  return {
    name: 'terraform',
    directory: options.infraProjectName,
    awsProfile: options.awsProfile,
    database: options.database,
    appType: 'SHARED_INFRA',
  };
}
