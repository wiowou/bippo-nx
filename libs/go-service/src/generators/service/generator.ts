import { addProjectConfiguration, formatFiles, Tree } from '@nx/devkit';
import { ServiceGeneratorSchema } from './schema';

import { addFiles, createProjectConfiguration, normalizeOptions, updateProjectJson } from './lib';

export default async function (tree: Tree, options: ServiceGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  addProjectConfiguration(tree, normalizedOptions.projectName, createProjectConfiguration(normalizedOptions));

  addFiles(tree, normalizedOptions);
  updateProjectJson(tree, normalizedOptions);
  await formatFiles(tree);
}
