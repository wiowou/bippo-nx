import * as path from 'path';
import { copyFile } from 'node:fs/promises';
import { FileReplacement } from '../schema';

import { NormalizedRunCommandsExecutorSchema } from '../schema';

export async function replaceFiles(fileReplacements: FileReplacement[], options: NormalizedRunCommandsExecutorSchema) {
  for (const fileReplacement of fileReplacements) {
    try {
      await copyFile(path.join(options.cwd, fileReplacement.with), path.join(options.cwd, fileReplacement.replace));
    } catch (e) {
      console.error(`Could not replace ${fileReplacement.replace} with ${fileReplacement.with}`, e);
    }
  }
}
