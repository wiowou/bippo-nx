import * as path from 'path';
import { ExecutorContext } from '@nx/devkit';
import { TfexecExecutorSchema, NormalizedTfexecExecutorSchema } from '../schema';

export function normalizeOptions(
  context: ExecutorContext,
  options: TfexecExecutorSchema
): NormalizedTfexecExecutorSchema {
  const cwd = options.cwd
    ? path.join(context.root, options.cwd)
    : context.projectsConfigurations?.projects[context.projectName]?.sourceRoot || process.cwd();
  console.log('current working directory', cwd); //TODO: remove
  if (!cwd) {
    throw Error('Current working directory could not be determined');
  }

  return {
    ...options,
    root: context.root,
    cwd,
  };
}
