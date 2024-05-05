import { execSync } from 'child_process';
import { ExecutorContext } from '@nx/devkit';
import { TfexecExecutorSchema, NormalizedTfexecExecutorSchema } from './schema';

import { normalizeOptions, replaceFiles } from './lib';

export default async function runExecutor(options: TfexecExecutorSchema, context: ExecutorContext) {
  const normalizedOptions = normalizeOptions(context, options);
  await replaceFiles(normalizedOptions.fileReplacements, normalizedOptions);
  const env = buildEnv(normalizedOptions);
  for (const command of normalizedOptions.commands) {
    console.log(command);
    try {
      execSync(command, {
        cwd: normalizedOptions.cwd,
        stdio: [0, 1, 2],
        env,
      });
    } catch (e) {
      console.error(`Failed to execute: ${command}`, e);
      return {
        success: false,
      };
    }
  }
  return {
    success: true,
  };
}

function buildEnv(options: NormalizedTfexecExecutorSchema) {
  const env = {
    ...process.env,
  };
  if (options.terraformRootPath) {
    env.PATH = `${process.env.PATH}:${options.terraformRootPath}`;
  }
  return env;
}
