import type { Tree } from '@nx/devkit';
import { getWorkspaceLayout, joinPathFragments, updateJson } from '@nx/devkit';

import type { NormalizedLambdaGeneratorSchema } from '../schema';

export function updateProjectJson(tree: Tree, options: NormalizedLambdaGeneratorSchema): void {
  if (!options.directory) {
    return;
  }
  const parentDirectory = `${getWorkspaceLayout(tree).appsDir}/${options.directory}`;
  try {
    updateJson(tree, joinPathFragments(parentDirectory, 'project.json'), (json) => {
      if (!json?.targets?.build?.dependsOn?.[0].projects) {
        return json;
      }
      json.targets.build.dependsOn[0].projects.push(options.projectName);
      return json;
    });
  } catch (error) {
    console.info(error.message);
  }
}
