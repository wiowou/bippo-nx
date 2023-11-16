import { ExecutorContext } from '@nx/devkit';
import { LambdaPackageExecutorSchema, NormalizedLambdaPackageExecutorSchema } from '../schema';

export function normalizeOptions(
  context: ExecutorContext,
  options: LambdaPackageExecutorSchema
): NormalizedLambdaPackageExecutorSchema {
  const sourceRoot = context.projectsConfigurations?.projects[context.projectName]?.sourceRoot || process.cwd();
  if (!sourceRoot) {
    throw Error('Project source root could not be determined');
  }

  return {
    ...options,
    outputPath: options.outputPath || sourceRoot,
    root: context.root,
    sourceRoot,
  };
}
