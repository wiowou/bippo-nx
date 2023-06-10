import { Database } from '@bippo-nx/types';

export interface TerraformGeneratorSchema extends TerraformOptions {
  name: string;
  directory?: string;
}

export interface TerraformOptions {
  awsProfile?: string;
  terraformVersion?: string;
  terraformAwsVersion?: string;
  database?: Database;
  appType?: 'SHARED_INFRA' | 'STEP_FUNCTION' | 'LAMBDA' | 'LAMBDA_SERVICE';
}
