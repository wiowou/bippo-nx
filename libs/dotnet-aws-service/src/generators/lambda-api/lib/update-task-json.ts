import type { Tree } from '@nx/devkit';
import { joinPathFragments, updateJson } from '@nx/devkit';

import type { NormalizedLambdaApiGeneratorSchema } from '../schema';

export function updateTaskJson(tree: Tree, options: NormalizedLambdaApiGeneratorSchema): void {
  updateJson(tree, joinPathFragments('.vscode', 'tasks.json'), (json) => {
    const configLabel = `build_${options.projectName}`;
    json.tasks = json.tasks.filter((i) => i.label != configLabel);
    const projFolder = '${workspaceFolder}/' + options.projectRoot;
    const launchConfig = {
      label: configLabel,
      command: 'dotnet',
      type: 'process',
      args: [
        'build',
        `${projFolder}/src/main.csproj`,
        '/property:GenerateFullPaths=true',
        '/consoleloggerparameters:NoSummary;ForceNoAlign',
      ],
      problemMatcher: '$msCompile',
    };
    json.tasks.push(launchConfig);
    return json;
  });
}
