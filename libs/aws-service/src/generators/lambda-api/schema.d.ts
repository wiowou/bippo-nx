import { TerraformOptions } from '@bippo-nx/terraform';

export interface LambdaApiGeneratorSchema extends TerraformOptions {
  name: string;
  database: string;
}
