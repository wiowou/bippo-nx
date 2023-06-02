import { TerraformOptions } from '@bippo-nx/terraform';

export interface LambdaGeneratorSchema extends TerraformOptions {
  name: string;
  database: string;
  directory?: string;
  generateTerraform: boolean;
}
