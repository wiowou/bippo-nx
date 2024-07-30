import { RunCommandsExecutorSchema } from './schema';
import executor from './executor';

const options: RunCommandsExecutorSchema = {};

describe('RunCommands Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
