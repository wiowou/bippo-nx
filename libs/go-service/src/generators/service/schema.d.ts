import { TerraformOptions } from '@bippo-nx/terraform';

export interface ServiceGeneratorSchema extends TerraformOptions {
  name: string;
  directory?: string;
}

interface NormalizedServiceGeneratorSchema extends ServiceGeneratorSchema {
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
