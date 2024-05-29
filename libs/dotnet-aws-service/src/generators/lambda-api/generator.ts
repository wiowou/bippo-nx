import { addProjectConfiguration, formatFiles, Tree } from '@nx/devkit';
import { terraformGenerator, TerraformGeneratorSchema } from '@bippo-nx/terraform';

import { addFiles, createProjectConfiguration, normalizeOptions, updateLaunchJson, updateTaskJson } from './lib';
import { LambdaApiGeneratorSchema } from './schema';

export default async function (tree: Tree, options: LambdaApiGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const appType = options.gatewayType === 'rest' ? 'LAMBDA_SERVICE_REST' : 'LAMBDA_SERVICE';
  const handler =
    options.gatewayType === 'rest'
      ? `${normalizedOptions.projectName}::${normalizedOptions.projectName}.LambdaEntryPoint::FunctionHandlerAsync`
      : `${normalizedOptions.projectName}`;
  const terraformGeneratorOptions: TerraformGeneratorSchema = {
    ...options,
    name: 'terraform',
    directory: normalizedOptions.projectDirectory,
    appType,
    database: options.database,
    handler,
  };
  await terraformGenerator(tree, terraformGeneratorOptions);
  updateLaunchJson(tree, normalizedOptions);
  updateTaskJson(tree, normalizedOptions);
  addProjectConfiguration(tree, normalizedOptions.projectName, createProjectConfiguration(normalizedOptions));
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
