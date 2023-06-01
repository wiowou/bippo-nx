import { TerraformOptions } from '@bippo-nx/terraform';

export interface Lambda1GeneratorSchema extends TerraformOptions {
  name: string;
  database: string;
}
