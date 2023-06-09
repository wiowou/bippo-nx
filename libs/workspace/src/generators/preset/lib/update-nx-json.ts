import type { Tree } from '@nx/devkit';
import { joinPathFragments, updateJson } from '@nx/devkit';

import type { NormalizedOptions } from '../schema';

export function updateNxJson(tree: Tree, options: NormalizedOptions): void {
  updateJson(tree, joinPathFragments('', 'nx.json'), (json) => {
    json.targetDefaults = {
      build: {
        dependsOn: ['^build'],
        inputs: ['prod', '^prod'],
      },
      test: {
        inputs: ['default', '^prod', '{workspaceRoot}/jest.preset.js'],
      },
      lint: {
        inputs: ['default', '{workspaceRoot}/.eslintrc.json', '{workspaceRoot}/.eslintignore'],
      },
      e2e: {
        inputs: ['default', '^prod'],
      },
      tfexec: {
        dependsOn: [
          {
            projects: [options.infraProjectName],
            target: 'tfexec',
            params: 'forward',
          },
        ],
      },
    };
    json.namedInputs = {
      default: ['{projectRoot}/**/*', 'sharedGlobals'],
      prod: [
        'default',
        '!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)',
        '!{projectRoot}/tsconfig.spec.json',
        '!{projectRoot}/jest.config.[jt]s',
        '!{projectRoot}/.eslintrc.json',
      ],
      sharedGlobals: ['{workspaceRoot}/babel.config.json'],
    };
    return json;
  });
}
