import { Database } from '@bippo-nx/types';
import { TerraformOptions } from '@bippo-nx/terraform';

export interface LambdaApiGeneratorSchema extends TerraformOptions {
  name: string;
  database: Database;
  directory?: string;
}
