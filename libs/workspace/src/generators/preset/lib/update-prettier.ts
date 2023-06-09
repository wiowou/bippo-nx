import type { Tree } from '@nx/devkit';
import { joinPathFragments, updateJson } from '@nx/devkit';

export function updatePrettier(tree: Tree): void {
  updateJson(tree, joinPathFragments('', '.prettierrc'), (json) => {
    json = {
      singleQuote: true,
      printWidth: 120,
    };
    return json;
  });
}
