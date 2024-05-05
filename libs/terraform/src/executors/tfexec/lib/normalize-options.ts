import * as path from 'path';
import { ExecutorContext } from '@nx/devkit';
import { TfexecExecutorSchema, NormalizedTfexecExecutorSchema } from '../schema';

export function normalizeOptions(
  context: ExecutorContext,
  options: TfexecExecutorSchema
): NormalizedTfexecExecutorSchema {
  const args = {};
  if (options.cmd) args['cmd'] = options.cmd;
  if (options.environment) args['environment'] = options.environment;
  for (const key in args) {
    options.cwd = replaceWithArgs(options.cwd, key, args[key]);
    options.terraformRootPath = replaceWithArgs(options.terraformRootPath, key, args[key]);
    for (const fileReplacement of options.fileReplacements) {
      fileReplacement.replace = replaceWithArgs(fileReplacement.replace, key, args[key]);
      fileReplacement.with = replaceWithArgs(fileReplacement.with, key, args[key]);
    }
    options.commands = options.commands.map((command) => replaceWithArgs(command, key, args[key]));
  }

  const cwd = options.cwd
    ? path.join(context.root, options.cwd)
    : context.projectsConfigurations?.projects[context.projectName]?.sourceRoot || process.cwd();
  if (!cwd) {
    throw Error('Current working directory could not be determined');
  }
  return {
    ...options,
    root: context.root,
    cwd,
  };
}

function replaceWithArgs(s: string, argName: string, argValue: string): string {
  if (!s) return s;
  const r = s.replace(new RegExp('{ *args\\.' + argName + ' *}', 'g'), argValue);
  return r;
}
