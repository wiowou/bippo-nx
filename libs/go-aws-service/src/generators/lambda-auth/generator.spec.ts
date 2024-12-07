import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { lambdaAuthGenerator } from './generator';
import { LambdaAuthGeneratorSchema } from './schema';

describe('lambda-auth generator', () => {
  let tree: Tree;
  const options: LambdaAuthGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await lambdaAuthGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
