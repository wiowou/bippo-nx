import type { Tree } from '@nx/devkit';
import { getWorkspaceLayout, joinPathFragments, updateJson } from '@nx/devkit';

import type { NormalizedLambdaAuthGeneratorSchema } from '../schema';

export function updateProjectJson(tree: Tree, options: NormalizedLambdaAuthGeneratorSchema): void {
  if (!options.directory) {
    return;
  }
  const parentDirectory = `${getWorkspaceLayout(tree).appsDir}/${options.directory}`;
  function findProjectName(el) {
    return el === options.projectName;
  }
  try {
    updateJson(tree, joinPathFragments(parentDirectory, 'project.json'), (json) => {
      if (json?.targets?.build?.dependsOn?.[0].projects?.findIndex(findProjectName) === -1) {
        json.targets.build.dependsOn[0].projects.push(options.projectName);
      }
      if (json?.targets?.tfexec?.dependsOn?.[0].projects?.findIndex(findProjectName) === -1) {
        json.targets.tfexec.dependsOn[0].projects.push(options.projectName);
      }
      if (json?.targets?.tfexec?.dependsOn?.[1].projects?.findIndex(findProjectName) === -1) {
        json.targets.tfexec.dependsOn[1].projects.push(options.projectName);
      }
      return json;
    });
  } catch (error) {
    console.info(error.message);
  }
}
