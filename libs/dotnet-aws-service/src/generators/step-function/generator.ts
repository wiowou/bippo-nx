import { addProjectConfiguration, formatFiles, Tree } from '@nx/devkit';
import { terraformGenerator, TerraformGeneratorSchema } from '@bippo-nx/terraform';

import { addFiles, createProjectConfiguration, normalizeOptions } from './lib';
import { LambdaGeneratorSchema } from '../lambda/schema';
import { StepFunctionGeneratorSchema } from './schema';
import { default as lambdaGenerator } from '../lambda/generator';

export async function stepFunctionGenerator(tree: Tree, options: StepFunctionGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const terraformGeneratorOptions: TerraformGeneratorSchema = {
    ...options,
    name: 'terraform',
    directory: normalizedOptions.projectDirectory,
    appType: 'STEP_FUNCTION',
    database: options.database,
  };
  await terraformGenerator(tree, terraformGeneratorOptions);

  addProjectConfiguration(tree, normalizedOptions.projectName, createProjectConfiguration(normalizedOptions));
  addFiles(tree, normalizedOptions);

  const lambdaGeneratorOptions: LambdaGeneratorSchema = {
    name: normalizedOptions.lambda,
    directory: normalizedOptions.projectDirectory,
    generateTerraform: true,
    database: 'none',
    awsProfile: normalizedOptions.awsProfile,
    requestType: 'Custom',
  };
  await lambdaGenerator(tree, lambdaGeneratorOptions);
  await formatFiles(tree);
}

export default stepFunctionGenerator;
