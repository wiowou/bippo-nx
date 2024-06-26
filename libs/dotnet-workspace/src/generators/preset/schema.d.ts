import { Database, UnitTestRunner } from '@bippo-nx/types';

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
  awsProfile: string;
  awsAccount: string;
  terraformVersion: string;
  terraformAwsVersion: string;
  database: Database;
}

interface NormalizedOptions extends PresetGeneratorSchema {
  appProjectRoot: Path;
  solutionGuid: string;
}
