import { Database } from '@bippo-nx/types';
import { TerraformOptions } from '@bippo-nx/terraform';

interface NormalizedLambdaApiGeneratorSchema extends LambdaApiGeneratorSchema {
  projectName: string;
  projectNamePascal: string;
  projectNameLower: string;
  projectRoot: string;
  projectDirectory: string;
  rootOffset: string;
  workspaceName: string;
}

export interface LambdaApiGeneratorSchema extends TerraformOptions {
  name: string;
  database: Database;
  directory?: string;
  gatewayType: 'rest' | 'http';
}
