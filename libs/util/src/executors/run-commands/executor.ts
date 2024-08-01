import * as path from 'path';
import { copyFile, cp, lstat, mkdir, rm, writeFile } from 'node:fs/promises';
import { execSync } from 'child_process';
import { ExecutorContext } from '@nx/devkit';
import { RunCommandsExecutorSchema } from './schema';

import { normalizeOptions, replaceFiles } from './lib';

export default async function runExecutor(options: RunCommandsExecutorSchema, context: ExecutorContext) {
  const normalizedOptions = normalizeOptions(context, options);
  if (normalizedOptions.emptyZip) {
    const fullPath = path.join(normalizedOptions.root, normalizedOptions.copyOutputToPath, 'main.zip');
    const baseDir = path.dirname(fullPath);
    await mkdir(baseDir, { recursive: true });
    await writeFile(fullPath, 'contents');
    return {
      success: true,
    };
  }
  await replaceFiles(normalizedOptions.fileReplacements, normalizedOptions);
  for (const cmd of normalizedOptions.commands) {
    try {
      execSync(cmd, {
        cwd: normalizedOptions.cwd ?? normalizedOptions.sourceRoot,
        stdio: [0, 1, 2],
      });
    } catch (e) {
      console.error(`Failed to execute command: ${cmd}`, e);
      return {
        success: false,
      };
    }
  }
  if (normalizedOptions.copyInputFromPath) {
    try {
      if ((await lstat(normalizedOptions.copyInputFromPath)).isFile()) {
        let outputPath = normalizedOptions.copyOutputToPath;
        if (!path.extname(normalizedOptions.copyOutputToPath)) {
          outputPath = path.join(
            normalizedOptions.copyOutputToPath,
            path.basename(normalizedOptions.copyInputFromPath)
          );
        }
        const baseDir = path.dirname(outputPath);
        await mkdir(baseDir, { recursive: true });
        await copyFile(normalizedOptions.copyInputFromPath, outputPath);
      } else if ((await lstat(normalizedOptions.copyInputFromPath)).isDirectory()) {
        const outputPath = path.join(
          normalizedOptions.copyOutputToPath,
          path.basename(normalizedOptions.copyInputFromPath)
        );
        const baseDir = path.dirname(outputPath);
        await mkdir(baseDir, { recursive: true });
        await cp(normalizedOptions.copyInputFromPath, outputPath, { recursive: true });
      }
      if (normalizedOptions.removeInputPath) {
        try {
          await rm(normalizedOptions.copyInputFromPath, { recursive: true });
        } catch (e) {
          console.error(`Failed to remove: ${normalizedOptions.copyInputFromPath}`, e);
          return {
            success: false,
          };
        }
      }
    } catch (e) {
      console.error(
        `Could not copy ${normalizedOptions.copyInputFromPath} to ${normalizedOptions.copyOutputToPath}`,
        e
      );
      return {
        success: false,
      };
    }
  }
  return {
    success: true,
  };
}
