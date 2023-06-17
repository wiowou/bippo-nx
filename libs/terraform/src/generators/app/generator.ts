import { addProjectConfiguration, formatFiles, Tree } from '@nx/devkit';
import { addFiles, createProjectConfiguration, normalizeOptions } from './lib';
import { TerraformGeneratorSchema } from './schema';

export default async function (tree: Tree, options: TerraformGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  addProjectConfiguration(tree, normalizedOptions.projectName, createProjectConfiguration(normalizedOptions));

  addFiles(tree, normalizedOptions);
  if (options.database === 'dynamo') {
    addFiles(tree, normalizedOptions, 'dynamo-files');
  }
  await formatFiles(tree);
}
