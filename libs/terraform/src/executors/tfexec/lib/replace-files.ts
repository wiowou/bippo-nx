import * as path from 'path';
import { copyFile } from 'node:fs/promises';
import { FileReplacement, NormalizedTfexecExecutorSchema } from '../schema';

export async function replaceFiles(fileReplacements: FileReplacement[], options: NormalizedTfexecExecutorSchema) {
  for (const fileReplacement of fileReplacements) {
    try {
      await copyFile(path.join(options.cwd, fileReplacement.with), path.join(options.cwd, fileReplacement.replace));
    } catch (e) {
      console.error(`Could not replace ${fileReplacement.replace} with ${fileReplacement.with}`, e);
    }
  }
}
