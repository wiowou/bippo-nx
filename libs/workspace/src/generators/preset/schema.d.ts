import { UnitTestRunner } from '../utils';

export interface PresetGeneratorSchema {
  name: string;
  infraProjectName?: string;
  directory?: string;
  linter?: 'eslint' | 'none';
  skipFormat?: boolean;
  skipPackageJson?: boolean;
  tags?: string;
  unitTestRunner?: UnitTestRunner;
  e2eTestRunner?: 'jest' | 'none';
  rootProject?: boolean;
  strict?: boolean;
  awsProfile?: string;
  database: string;
}

interface NormalizedOptions extends PresetGeneratorSchema {
  appProjectRoot: Path;
}
