import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { lambdaApiGenerator } from './generator';
import { LambdaApiGeneratorSchema } from './schema';

describe('lambda-api generator', () => {
  let tree: Tree;
  const options: LambdaApiGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await lambdaApiGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
