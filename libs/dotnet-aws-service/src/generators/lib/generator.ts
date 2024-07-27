import { addProjectConfiguration, formatFiles, Tree } from '@nx/devkit';

import { addFiles, createProjectConfiguration, normalizeOptions } from './lib';
import { LibGeneratorSchema } from './schema';

export default async function (tree: Tree, options: LibGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addProjectConfiguration(
    tree,
    normalizedOptions.projectName + normalizedOptions.libraryType === 'api' ? 'Lib' : '',
    createProjectConfiguration(normalizedOptions)
  );
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
