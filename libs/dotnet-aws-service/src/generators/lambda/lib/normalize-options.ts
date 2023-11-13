import { getWorkspaceLayout, names, offsetFromRoot, Tree, workspaceRoot } from '@nx/devkit';
import * as path from 'path';
import { LambdaGeneratorSchema, NormalizedLambdaGeneratorSchema } from '../schema';

export function normalizeOptions(tree: Tree, options: LambdaGeneratorSchema): NormalizedLambdaGeneratorSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const rootOffset = offsetFromRoot(projectRoot);
  const workspaceName = path.basename(tree.root);
  const awsProfile = options.awsProfile || 'devopslocal';
  const functionName = name;
  const functionNameSnakeCase = name.replace(new RegExp('-', 'g'), '_');

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    rootOffset,
    workspaceName,
    workspaceRoot,
    awsProfile,
    functionName,
    functionNameSnakeCase,
  };
}
