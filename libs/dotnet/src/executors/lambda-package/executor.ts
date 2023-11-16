import { execSync } from 'child_process';
import * as path from 'path';
import { ExecutorContext } from '@nx/devkit';
import { LambdaPackageExecutorSchema } from './schema';

import { normalizeOptions, replaceFiles } from './lib';

export default async function runExecutor(options: LambdaPackageExecutorSchema, context: ExecutorContext) {
  const normalizedOptions = normalizeOptions(context, options);
  await replaceFiles(normalizedOptions.fileReplacements, normalizedOptions.root);
  const { root, outputPath, configurationType, functionArchitecture } = normalizedOptions;
  const command = `dotnet lambda package -o ${path.join(
    root,
    outputPath
  )}/main.zip -c ${configurationType} -farch ${functionArchitecture}`;
  console.log(command);
  try {
    execSync(command, {
      cwd: normalizedOptions.sourceRoot,
      stdio: [0, 1, 2],
      env: {
        ...process.env,
        DOTNET_ROOT: options.dotnetRootPath,
        PATH: `${process.env.PATH}:${options.dotnetRootPath}:${options.dotnetToolsPath}`,
      },
    });
    return {
      success: true,
    };
  } catch (e) {
    console.error('Failed to execute lambda package command', e);
    return {
      success: false,
    };
  }
}
