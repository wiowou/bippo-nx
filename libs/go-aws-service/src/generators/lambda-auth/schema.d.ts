import { TerraformOptions } from '@bippo-nx/terraform';

export interface LambdaAuthGeneratorSchema extends TerraformOptions {
  name: string;
  directory?: string;
  generateTerraform: boolean;
  runtime: string;
}

interface NormalizedLambdaAuthGeneratorSchema extends LambdaAuthGeneratorSchema {
  projectName: string;
  projectNamePascal: string;
  projectRoot: string;
  projectDirectory: string;
  rootOffset: string;
  workspaceName: string;
  workspaceRoot: string;
  functionName: string;
  functionNameSnakeCase: string;
}
