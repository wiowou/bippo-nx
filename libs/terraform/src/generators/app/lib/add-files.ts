import { generateFiles, names, offsetFromRoot, Tree } from '@nx/devkit';
import * as path from 'path';

import { NormalizedTerraformGeneratorSchema } from '../schema';

export function addFiles(tree: Tree, options: NormalizedTerraformGeneratorSchema, target = 'files') {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, target), options.projectRoot, templateOptions);
}
