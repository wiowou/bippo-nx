import { getWorkspaceLayout, names, offsetFromRoot, Tree, workspaceRoot } from '@nx/devkit';
import * as path from 'path';
import * as changeCase from '../../utils/change-case';
import { LambdaAuthGeneratorSchema, NormalizedLambdaAuthGeneratorSchema } from '../schema';

export function normalizeOptions(tree: Tree, options: LambdaAuthGeneratorSchema): NormalizedLambdaAuthGeneratorSchema {
  // const name = names(options.name).fileName;
  // const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  const name = options.name;
  const projectDirectory = options.directory ? `${options.directory}/${name}` : name;
  const projectName = projectDirectory.replace(new RegExp('[_/]', 'g'), '-');
  const projectNamePascal = changeCase.pascalCase(projectName);
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const rootOffset = offsetFromRoot(projectRoot);
  const workspaceName = path.basename(tree.root);
  const awsProfile = options.awsProfile;
  const functionName = name;
  const functionNameSnakeCase = name.replace(new RegExp('-', 'g'), '_');

  return {
    ...options,
    projectName,
    projectNamePascal,
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
