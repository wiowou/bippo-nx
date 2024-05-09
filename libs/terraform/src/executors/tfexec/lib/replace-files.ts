import * as path from 'path';
import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { FileReplacement, NormalizedTfexecExecutorSchema } from '../schema';

export async function replaceFiles(fileReplacements: FileReplacement[], options: NormalizedTfexecExecutorSchema) {
  const args = {
    projectKey: options?.projectKey || undefined,
    environment: options?.environment || undefined,
  };
  for (const fileReplacement of fileReplacements) {
    try {
      //await copyFile(path.join(options.cwd, fileReplacement.with), path.join(options.cwd, fileReplacement.replace));
      let fileContents = await readFile(path.join(options.cwd, fileReplacement.with), 'utf8');
      for (const [argName, argValue] of Object.entries(args)) {
        fileContents = fileContents.replace(new RegExp('{ *args\\.' + argName + ' *}', 'g'), argValue);
      }
      await writeFile(path.join(options.cwd, fileReplacement.replace), fileContents);
    } catch (e) {
      console.error(`Could not replace ${fileReplacement.replace} with ${fileReplacement.with}`, e);
    }
  }
}
