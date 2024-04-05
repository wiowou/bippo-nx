import { Database } from '@bippo-nx/types';
import { TerraformOptions } from '@bippo-nx/terraform';

interface NormalizedLambdaGeneratorSchema extends LambdaGeneratorSchema {
  projectName: string;
  projectNamePascal: string;
  projectRoot: string;
  projectDirectory: string;
  rootOffset: string;
  workspaceName: string;
  workspaceRoot: string;
  awsProfile: string;
  functionName: string;
  functionNameSnakeCase: string;
}

export interface LambdaGeneratorSchema extends TerraformOptions {
  name: string;
  database: Database;
  directory?: string;
  generateTerraform: boolean;
}
