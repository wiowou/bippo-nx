import { addProjectConfiguration, formatFiles, Tree } from '@nx/devkit';
import { terraformGenerator, TerraformGeneratorSchema } from '@bippo-nx/terraform';

import { addFiles, createProjectConfiguration, normalizeOptions, updateLaunchJson, updateTaskJson } from './lib';
import { LambdaApiGeneratorSchema } from './schema';

export default async function (tree: Tree, options: LambdaApiGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const terraformGeneratorOptions: TerraformGeneratorSchema = {
    ...options,
    name: 'terraform',
    directory: normalizedOptions.projectDirectory,
    appType: 'LAMBDA_SERVICE',
    database: options.database,
    handler: `${normalizedOptions.projectName}`,
  };
  await terraformGenerator(tree, terraformGeneratorOptions);
  updateLaunchJson(tree, normalizedOptions);
  updateTaskJson(tree, normalizedOptions);
  addProjectConfiguration(tree, normalizedOptions.projectName, createProjectConfiguration(normalizedOptions));
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
