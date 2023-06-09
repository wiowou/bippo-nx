import { UnitTestRunner } from '../utils';

export interface PresetGeneratorSchema {
  name: string;
  directory?: string;
  frontendProject?: string;
  linter?: Linter;
  skipFormat?: boolean;
  skipPackageJson?: boolean;
  tags?: string;
  unitTestRunner?: UnitTestRunner;
  e2eTestRunner?: 'jest' | 'none';
  setParserOptionsProject?: boolean;
  rootProject?: boolean;
  strict?: boolean;
}

interface NormalizedOptions extends PresetGeneratorSchema {
  appProjectRoot: Path;
}
