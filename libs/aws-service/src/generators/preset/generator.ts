import type { GeneratorCallback, Tree } from '@nx/devkit';
import { convertNxGenerator, formatFiles, runTasksInSerial } from '@nx/devkit';
// import { applicationGenerator as nodeApplicationGenerator } from '@nx/node';

import { initGenerator } from '../init/generator';
import { createFiles, normalizeOptions, updateTsConfig } from './lib';
import { PresetGeneratorSchema } from './schema';

export async function presetGenerator(tree: Tree, rawOptions: PresetGeneratorSchema): Promise<GeneratorCallback> {
  const options = normalizeOptions(tree, rawOptions);
  const initTask = await initGenerator(tree, {
    skipPackageJson: options.skipPackageJson,
    unitTestRunner: options.unitTestRunner,
    skipFormat: true,
  });
  // const nodeApplicationTask = await nodeApplicationGenerator(tree, toNodeApplicationGeneratorOptions(options));
  createFiles(tree, options);
  updateTsConfig(tree, options);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  // return runTasksInSerial(initTask, nodeApplicationTask);
  return runTasksInSerial(initTask);
}

export default presetGenerator;

export const applicationSchematic = convertNxGenerator(presetGenerator);
