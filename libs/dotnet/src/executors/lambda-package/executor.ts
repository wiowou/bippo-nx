import { execSync } from 'child_process';
import * as path from 'path';
import { writeFile, mkdir } from 'node:fs/promises';
import { ExecutorContext } from '@nx/devkit';
import { LambdaPackageExecutorSchema, NormalizedLambdaPackageExecutorSchema } from './schema';

import { normalizeOptions, replaceFiles } from './lib';

export default async function runExecutor(options: LambdaPackageExecutorSchema, context: ExecutorContext) {
  const normalizedOptions = normalizeOptions(context, options);
  await replaceFiles(normalizedOptions.fileReplacements, normalizedOptions);
  const command = buildCommand(normalizedOptions);
  console.log(command);
  if (normalizedOptions.emptyZip) {
    const fullPath = path.join(normalizedOptions.root, normalizedOptions.outputPath, 'main.zip');
    const baseDir = path.dirname(fullPath);
    await mkdir(baseDir, { recursive: true });
    await writeFile(fullPath, 'contents');
    return {
      success: true,
    };
  }
  try {
    execSync('dotnet restore', {
      cwd: normalizedOptions.sourceRoot,
      stdio: [0, 1, 2],
      env: buildEnv(normalizedOptions),
    });
    execSync('dotnet tool restore', {
      cwd: normalizedOptions.sourceRoot,
      stdio: [0, 1, 2],
      env: buildEnv(normalizedOptions),
    });
    execSync(command, {
      cwd: normalizedOptions.sourceRoot,
      stdio: [0, 1, 2],
      env: buildEnv(normalizedOptions),
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

function buildCommand(options: NormalizedLambdaPackageExecutorSchema): string {
  const { root, outputPath, configurationType, functionArchitecture } = options;
  const command = `dotnet lambda package -o ${path.join(
    root,
    outputPath,
    'main.zip'
  )} -c ${configurationType} -farch ${functionArchitecture}`;
  return command;
}

function buildEnv(options: NormalizedLambdaPackageExecutorSchema) {
  const env = {
    ...process.env,
  };
  env.ROOT = options.root;
  env.DOTNET_CLI_TELEMETRY_OPTOUT = '1';
  if (options.dotnetRootPath) {
    env.DOTNET_ROOT = options.dotnetRootPath;
    env.PATH = `${process.env.PATH}:${options.dotnetRootPath}`;
    if (options.dotnetToolsPath) {
      env.PATH = `${process.env.PATH}:${options.dotnetRootPath}:${options.dotnetToolsPath}`;
    }
  } else if (options.dotnetToolsPath) {
    env.PATH = `${process.env.PATH}:${options.dotnetToolsPath}`;
  }
  return env;
}
