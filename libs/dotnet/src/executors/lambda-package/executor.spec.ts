import { LambdaPackageExecutorSchema } from './schema';
import executor from './executor';

const options: LambdaPackageExecutorSchema = {};

describe('LambdaPackage Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
