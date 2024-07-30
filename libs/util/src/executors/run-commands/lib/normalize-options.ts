import * as path from 'path';
import { ExecutorContext } from '@nx/devkit';
import { RunCommandsExecutorSchema, NormalizedRunCommandsExecutorSchema } from '../schema';

export function normalizeOptions(
  context: ExecutorContext,
  options: RunCommandsExecutorSchema
): NormalizedRunCommandsExecutorSchema {
  const sourceRoot = context.projectsConfigurations?.projects[context.projectName]?.sourceRoot || process.cwd();
  if (!sourceRoot) {
    throw Error('Project source root could not be determined');
  }
  const cwd = options.cwd
    ? path.join(context.root, options.cwd)
    : context.projectsConfigurations?.projects[context.projectName]?.sourceRoot || process.cwd();

  const copyInputFromPath = options.copyInputFromPath ? path.join(context.root, options.copyInputFromPath) : null;

  let copyOutputToPath = null;
  if (options.copyInputFromPath) {
    copyOutputToPath = options.copyOutputToPath
      ? path.join(context.root, options.copyOutputToPath)
      : context.projectsConfigurations?.projects[context.projectName]?.sourceRoot;
  }

  return {
    ...options,
    copyInputFromPath,
    copyOutputToPath,
    root: context.root,
    sourceRoot,
    cwd,
  };
}
