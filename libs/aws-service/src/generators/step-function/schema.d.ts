import { TerraformOptions } from '@bippo-nx/terraform';

export interface StepFunctionGeneratorSchema extends TerraformOptions {
  name: string;
  directory?: string;
  lambda?: string;
}
