import * as path from 'path';
import { copyFile } from 'node:fs/promises';
import { FileReplacement } from '../schema';

import { NormalizedLambdaPackageExecutorSchema } from '../schema';

export async function replaceFiles(
  fileReplacements: FileReplacement[],
  options: NormalizedLambdaPackageExecutorSchema
) {
  for (const fileReplacement of fileReplacements) {
    try {
      await copyFile(path.join(options.cwd, fileReplacement.with), path.join(options.cwd, fileReplacement.replace));
    } catch (e) {
      console.error(`Could not replace ${fileReplacement.replace} with ${fileReplacement.with}`, e);
    }
  }
}
