import { addProjectConfiguration, formatFiles, Tree } from '@nx/devkit';
import { terraformGenerator, TerraformGeneratorSchema } from '@bippo-nx/terraform';
import { libGenerator, LibGeneratorSchema } from '@bippo-nx/dotnet-aws-service';

import { addFiles, createProjectConfiguration, normalizeOptions, updateLaunchJson, updateTaskJson } from './lib';
import { LambdaApiGeneratorSchema } from './schema';

export default async function (tree: Tree, options: LambdaApiGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const appType = options.gatewayType === 'rest' ? 'LAMBDA_SERVICE_REST' : 'LAMBDA_SERVICE';
  const handler =
    options.gatewayType === 'rest'
      ? `${normalizedOptions.projectNamePascal}::${normalizedOptions.projectNamePascal}.LambdaEntryPoint::FunctionHandlerAsync`
      : `${normalizedOptions.projectNamePascal}`;
  if (options.createLibrary) {
    const libGeneratorOptions: LibGeneratorSchema = {
      name: options.name,
      directory: options.directory,
      libraryType: 'api',
    };
    await libGenerator(tree, libGeneratorOptions);
  }
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
