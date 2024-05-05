import * as path from 'path';
import { copyFile } from 'node:fs/promises';
import { FileReplacement, NormalizedTfexecExecutorSchema } from '../schema';

export async function replaceFiles(
  fileReplacements: FileReplacement[],
  options: NormalizedTfexecExecutorSchema,
  args: Record<string, string>
) {
  for (const fileReplacement of fileReplacements) {
    try {
      let replaceWith = fileReplacement.with;
      for (const key in args) {
        replaceWith = replaceWithArgs(replaceWith, key, args[key]);
      }
      await copyFile(path.join(options.cwd, replaceWith), path.join(options.cwd, fileReplacement.replace));
    } catch (e) {
      console.error(`Could not replace ${fileReplacement.replace} with ${fileReplacement.with}`, e);
    }
  }
}

function replaceWithArgs(s: string, argName: string, argValue: string): string {
  const r = s.replace(new RegExp('{ *args\\.' + argName + ' *}', 'g'), argValue);
  return r;
}
