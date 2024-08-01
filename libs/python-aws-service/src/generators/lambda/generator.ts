import { addProjectConfiguration, formatFiles, Tree } from '@nx/devkit';
import { LambdaGeneratorSchema } from './schema';

import { terraformGenerator, TerraformGeneratorSchema } from '@bippo-nx/terraform';

import { addFiles, createProjectConfiguration, normalizeOptions, updateProjectJson } from './lib';

export default async function (tree: Tree, options: LambdaGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  if (options.generateTerraform) {
    const terraformGeneratorOptions: TerraformGeneratorSchema = {
      ...options,
      name: 'terraform',
      directory: normalizedOptions.projectDirectory,
      appType: 'UTILLAMBDA',
      database: options.database,
      handler: 'lambda_function.lambda_handler',
    };
    await terraformGenerator(tree, terraformGeneratorOptions);
  }

  addProjectConfiguration(tree, normalizedOptions.projectName, createProjectConfiguration(normalizedOptions));

  addFiles(tree, normalizedOptions);
  updateProjectJson(tree, normalizedOptions);
  await formatFiles(tree);
}
