import type { Tree } from '@nx/devkit';
import { joinPathFragments, updateJson } from '@nx/devkit';
import type { NormalizedOptions } from '../schema';

export function updateTsConfig(tree: Tree, options: NormalizedOptions): void {
  updateJson(tree, joinPathFragments('', 'tsconfig.base.json'), (json) => {
    json.compilerOptions.emitDecoratorMetadata = true;
    json.compilerOptions.target = 'es2022';
    json.compilerOptions.lib = ['es2022', 'dom'];
    json.compilerOptions.sourceMap = true;
    if (options.strict) {
      json.compilerOptions = {
        ...json.compilerOptions,
        strictNullChecks: true,
        noImplicitAny: true,
        strictBindCallApply: true,
        forceConsistentCasingInFileNames: true,
        noFallthroughCasesInSwitch: true,
      };
    }
    return json;
  });
}
