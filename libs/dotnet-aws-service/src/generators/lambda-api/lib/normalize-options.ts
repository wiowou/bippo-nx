import { getWorkspaceLayout, names, offsetFromRoot, Tree } from '@nx/devkit';
import * as path from 'path';
import * as changeCase from 'change-case';
import { NormalizedLambdaApiGeneratorSchema, LambdaApiGeneratorSchema } from '../schema';

export function normalizeOptions(tree: Tree, options: LambdaApiGeneratorSchema): NormalizedLambdaApiGeneratorSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectNamePascal = changeCase.pascalCase(projectName);
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const rootOffset = offsetFromRoot(projectRoot);
  const workspaceName = path.basename(tree.root);

  return {
    ...options,
    projectName,
    projectNamePascal,
    projectRoot,
    projectDirectory,
    rootOffset,
    workspaceName,
  };
}
