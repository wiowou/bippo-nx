import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { TerraformGeneratorSchema } from './schema';

interface NormalizedSchema extends TerraformGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  rootOffset: string;
}

function normalizeOptions(
  tree: Tree,
  options: TerraformGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];
  const awsaccount = options?.awsaccount || '000000000000';
  const rootOffset = offsetFromRoot(projectRoot);

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    awsaccount,
    rootOffset,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (tree: Tree, options: TerraformGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/terraform`,
    targets: {
      tfexec: {
        executor: 'nx:run-commands',
        options: {
          parallel: false,
          cwd: `${normalizedOptions.projectRoot}/terraform`,
          commands: [
            'cp environments/{args.environment}.tfvars terraform.tfvars',
            'cp environments/provider.{args.environment}.tf provider.tf',
            'terraform {args.cmd}',
          ],
        },
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
