import { addProjectConfiguration, formatFiles, Tree } from '@nx/devkit';
import { LambdaGeneratorSchema } from './schema';

import { terraformGenerator, TerraformGeneratorSchema } from '@bippo-nx/terraform';

import { addFiles, createProjectConfiguration, normalizeOptions, updateIndex, updateProjectJson } from './lib';

export default async function (tree: Tree, options: LambdaGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  if (options.generateTerraform) {
    const terraformGeneratorOptions: TerraformGeneratorSchema = {
      ...options,
      name: 'terraform',
      directory: normalizedOptions.projectDirectory,
      appType: 'LAMBDA',
      database: options.database,
    };
    await terraformGenerator(tree, terraformGeneratorOptions);
  }

  addProjectConfiguration(tree, normalizedOptions.projectName, createProjectConfiguration(normalizedOptions));

  //const awsProfile = options.awsProfile || 'devopslocal';

  addFiles(tree, normalizedOptions);
  updateProjectJson(tree, normalizedOptions);
  updateIndex(tree, normalizedOptions);
  await formatFiles(tree);
}
