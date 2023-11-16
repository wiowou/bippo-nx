import * as path from 'path';
import { copyFile } from 'node:fs/promises';
import { FileReplacement } from '../schema';

export async function replaceFiles(fileReplacements: FileReplacement[], root: string) {
  for (const fileReplacement of fileReplacements) {
    try {
      await copyFile(path.join(root, fileReplacement.with), path.join(root, fileReplacement.replace));
    } catch (e) {
      console.error(`Could not replace ${fileReplacement.replace} with ${fileReplacement.with}`, e);
    }
  }
}
