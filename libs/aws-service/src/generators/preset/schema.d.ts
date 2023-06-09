import { UnitTestRunner } from '../utils';

export interface PresetGeneratorSchema {
  name: string;
  directory?: string;
  linter?: Linter;
  skipFormat?: boolean;
  skipPackageJson?: boolean;
  tags?: string;
  unitTestRunner?: UnitTestRunner;
  e2eTestRunner?: 'jest' | 'none';
  rootProject?: boolean;
  strict?: boolean;
}

interface NormalizedOptions extends PresetGeneratorSchema {
  appProjectRoot: Path;
}
