import type { Tree } from '@nx/devkit';
import { joinPathFragments, updateJson } from '@nx/devkit';

import type { NormalizedSchema } from '../schema';

export function updateTsConfigBase(tree: Tree, options: NormalizedSchema): void {
  updateJson(tree, joinPathFragments('', 'tsconfig.base.json'), (json) => {
    json.compilerOptions.paths[`@${options.workspaceName}/${options.projectDirectory}`] = [
      `${options.projectRoot}/src/index.ts`,
    ];
    return json;
  });
}
