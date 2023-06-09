import type { Tree } from '@nx/devkit';
import { joinPathFragments, updateJson } from '@nx/devkit';

export function updateNxJson(tree: Tree): void {
  updateJson(tree, joinPathFragments('', 'nx.json'), (json) => {
    json.targetDefaults = {
      ...json.targetDefaults,
      tfexec: {
        dependsOn: [
          {
            projects: ['shared-infra'],
            target: 'tfexec',
            params: 'forward',
          },
        ],
      },
    };
    return json;
  });
}
