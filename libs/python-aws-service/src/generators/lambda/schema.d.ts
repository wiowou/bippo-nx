import { TerraformOptions } from '@bippo-nx/terraform';

export interface LambdaGeneratorSchema extends TerraformOptions {
  name: string;
  directory?: string;
  generateTerraform: boolean;
}

interface NormalizedLambdaGeneratorSchema extends LambdaGeneratorSchema {
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
