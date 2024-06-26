import { TfexecExecutorSchema } from './schema';
import executor from './executor';

const options: TfexecExecutorSchema = {};

describe('Tfexec Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
