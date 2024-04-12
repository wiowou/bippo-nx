import type { Tree } from '@nx/devkit';
import { joinPathFragments, updateJson } from '@nx/devkit';

import type { NormalizedLambdaApiGeneratorSchema } from '../schema';

export function updateLaunchJson(tree: Tree, options: NormalizedLambdaApiGeneratorSchema): void {
  updateJson(tree, joinPathFragments('.vscode', 'launch.json'), (json) => {
    const configName = `Serve ${options.projectName}`;
    json.configurations = json.configurations.filter((i) => i.name != configName);
    const projFolder = '${workspaceFolder}/' + options.projectRoot;
    const launchConfig = {
      name: configName,
      type: 'coreclr',
      request: 'launch',
      preLaunchTask: `build_${options.projectName}`,
      program: `${projFolder}/src/bin/Debug/net8.0/${options.projectNameLower}.dll`,
      args: [],
      cwd: `${projFolder}/src`,
      stopAtEntry: false,
      serverReadyAction: {
        action: 'openExternally',
        pattern: '\\bNow listening on:\\s+(https?://\\S+)',
        uriFormat: '%s/swagger',
      },
      env: {
        ASPNETCORE_ENVIRONMENT: 'Development',
      },
      sourceFileMap: {
        '/Views': `${projFolder}/src/Views`,
      },
    };
    json.configurations.push(launchConfig);
    return json;
  });
}
