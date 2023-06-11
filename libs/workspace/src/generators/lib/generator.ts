import { addProjectConfiguration, formatFiles, ProjectConfiguration, Tree } from '@nx/devkit';

import { LibGeneratorSchema, NormalizedSchema } from './schema';
import { addFiles, normalizeOptions, updateTsConfigBase } from './lib';

export default async function (tree: Tree, options: LibGeneratorSchema) {
  const normalizedOptions: NormalizedSchema = normalizeOptions(tree, options);

  const projectConfiguration: ProjectConfiguration = {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      lint: {
        executor: '@nx/linter:eslint',
        outputs: ['{options.outputFile}'],
        options: {
          lintFilePatterns: [`${normalizedOptions.projectRoot}/**/*.ts`],
        },
      },
      test: {
        executor: '@nx/jest:jest',
        outputs: ['{workspaceRoot}/coverage/{projectRoot}'],
        options: {
          jestConfig: `${normalizedOptions.projectRoot}/jest.config.ts`,
          passWithNoTests: true,
        },
        configurations: {
          ci: {
            ci: true,
            codeCoverage: true,
          },
        },
      },
    },
    tags: [],
  };
  addProjectConfiguration(tree, normalizedOptions.projectName, projectConfiguration);
  addFiles(tree, normalizedOptions);
  updateTsConfigBase(tree, normalizedOptions);
  await formatFiles(tree);
}
