import { Database } from '@bippo-nx/types';
import { TerraformOptions } from '@bippo-nx/terraform';

export interface LambdaGeneratorSchema extends TerraformOptions {
  name: string;
  database: Database;
  directory?: string;
  generateTerraform: boolean;
}
