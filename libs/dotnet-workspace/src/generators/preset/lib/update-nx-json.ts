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
      tfinit: {
        dependsOn: [
          {
            projects: [options.infraProjectName + '-tf'],
            target: 'tfinit',
            params: 'forward',
          },
        ],
      },
      tfplan: {
        dependsOn: [
          {
            projects: [options.infraProjectName + '-tf'],
            target: 'tfplan',
            params: 'forward',
          },
        ],
      },
      tfapply: {
        dependsOn: [
          {
            projects: [options.infraProjectName + '-tf'],
            target: 'tfapply',
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
