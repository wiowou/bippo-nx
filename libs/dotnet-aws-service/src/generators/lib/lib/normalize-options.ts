import { getWorkspaceLayout, names, offsetFromRoot, Tree, workspaceRoot } from '@nx/devkit';
import * as path from 'path';
import { LibGeneratorSchema, NormalizedLibGeneratorSchema } from '../schema';

export function normalizeOptions(tree: Tree, options: LibGeneratorSchema): NormalizedLibGeneratorSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const rootOffset = offsetFromRoot(projectRoot);
  const workspaceName = path.basename(tree.root);

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    rootOffset,
    workspaceName,
    workspaceRoot,
  };
}
