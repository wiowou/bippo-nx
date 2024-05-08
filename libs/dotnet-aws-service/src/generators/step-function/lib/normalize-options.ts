import { getWorkspaceLayout, names, offsetFromRoot, Tree } from '@nx/devkit';
import * as path from 'path';
import { NormalizedStepFunctionGeneratorSchema, StepFunctionGeneratorSchema } from '../schema';

export function normalizeOptions(
  tree: Tree,
  options: StepFunctionGeneratorSchema
): NormalizedStepFunctionGeneratorSchema {
  // const name = names(options.name).fileName;
  // const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  const name = options.name;
  const projectDirectory = options.directory ? `${options.directory}/${name}` : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const rootOffset = offsetFromRoot(projectRoot);
  const workspaceName = path.basename(tree.root);
  const lambda = options.lambda || 'state0';

  return {
    ...options,
    lambda,
    projectName,
    projectRoot,
    projectDirectory,
    rootOffset,
    workspaceName,
  };
}
