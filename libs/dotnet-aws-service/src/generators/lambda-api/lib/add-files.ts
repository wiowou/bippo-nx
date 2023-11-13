import { generateFiles, names, offsetFromRoot, Tree } from '@nx/devkit';
import * as path from 'path';
import { NormalizedLambdaApiGeneratorSchema } from '../schema';

export function addFiles(tree: Tree, options: NormalizedLambdaApiGeneratorSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}
