import type { GeneratorCallback, Tree } from '@nx/devkit';
import { convertNxGenerator, formatFiles, runTasksInSerial } from '@nx/devkit';

import { initGenerator } from '../init/generator';
import {
  createFiles,
  normalizeOptions,
  toTerraformGeneratorOptions,
  updateNxJson,
  updatePrettier,
  updateTsConfig,
} from './lib';
import { PresetGeneratorSchema } from './schema';

import { terraformGenerator, TerraformGeneratorSchema } from '@bippo-nx/terraform';

export async function presetGenerator(tree: Tree, rawOptions: PresetGeneratorSchema): Promise<GeneratorCallback> {
  const options = normalizeOptions(tree, rawOptions);
  const initTask = await initGenerator(tree, {
    skipPackageJson: options.skipPackageJson,
    unitTestRunner: options.unitTestRunner,
    skipFormat: true,
  });
  createFiles(tree, options);
  updateTsConfig(tree, options);
  updateNxJson(tree, options);
  updatePrettier(tree);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }
  const terraformGeneratorOptions: TerraformGeneratorSchema = toTerraformGeneratorOptions(tree, options);
  await terraformGenerator(tree, terraformGeneratorOptions);
  return runTasksInSerial(initTask);
}

export default presetGenerator;

export const applicationSchematic = convertNxGenerator(presetGenerator);
