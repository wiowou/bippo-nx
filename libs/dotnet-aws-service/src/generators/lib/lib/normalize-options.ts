import { getWorkspaceLayout, names, offsetFromRoot, Tree, workspaceRoot } from '@nx/devkit';
import * as path from 'path';
import * as changeCase from '../../utils/change-case';
import { LibGeneratorSchema, NormalizedLibGeneratorSchema } from '../schema';

export function normalizeOptions(tree: Tree, options: LibGeneratorSchema): NormalizedLibGeneratorSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  const projectName = projectDirectory.replace(new RegExp('[_/]', 'g'), '-');
  const projectNamePascal = changeCase.pascalCase(projectName);
  const projectNameLower = projectNamePascal.toLowerCase();
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const rootOffset = offsetFromRoot(projectRoot);
  const workspaceName = path.basename(tree.root);

  return {
    ...options,
    projectName,
    projectNamePascal,
    projectNameLower,
    projectRoot,
    projectDirectory,
    rootOffset,
    workspaceName,
    workspaceRoot,
  };
}
