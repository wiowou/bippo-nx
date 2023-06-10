import { formatFiles, generateFiles, getWorkspaceLayout, names, offsetFromRoot, Tree } from '@nx/devkit';
import * as path from 'path';
import { StepFunctionGeneratorSchema } from './schema';

import { terraformGenerator, TerraformGeneratorSchema } from '@bippo-nx/terraform';

import { LambdaGeneratorSchema } from '../lambda/schema';
import { default as lambdaGenerator } from '../lambda/generator';

interface NormalizedSchema extends StepFunctionGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  rootOffset: string;
  workspaceName: string;
}

function normalizeOptions(tree: Tree, options: TerraformGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const rootOffset = offsetFromRoot(projectRoot);
  const workspaceName = path.basename(tree.root);

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    rootOffset,
    workspaceName,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

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

  const lambdaGeneratorOptions: LambdaGeneratorSchema = {
    name: 'state0',
    directory: normalizedOptions.projectDirectory,
    generateTerraform: false,
    database: 'none',
  };
  await lambdaGenerator(tree, lambdaGeneratorOptions);
  // addProjectConfiguration(tree, normalizedOptions.projectName, {
  //   root: normalizedOptions.projectRoot,
  //   projectType: 'library',
  //   sourceRoot: `${normalizedOptions.projectRoot}/src`,
  //   targets: {},
  // });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

export default stepFunctionGenerator;
