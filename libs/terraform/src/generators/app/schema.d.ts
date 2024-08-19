import { Database } from '@bippo-nx/types';

interface NormalizedTerraformGeneratorSchema extends TerraformGeneratorSchema {
  projectName: string;
  parentProjectName: string;
  projectRoot: string;
  projectDirectory: string;
  rootOffset: string;
  localBuildOffset: string;
  workspaceName: string;
  awsAccount: string;
  applicationDirectory: string;
}

export interface TerraformGeneratorSchema extends TerraformOptions {
  name: string;
  directory?: string;
}

export interface TerraformOptions {
  awsProfile: string;
  terraformVersion?: string;
  terraformAwsVersion?: string;
  database?: Database;
  appType?:
    | 'SHARED_INFRA'
    | 'STEP_FUNCTION'
    | 'LAMBDA'
    | 'UTILLAMBDA'
    | 'LAMBDA_SERVICE'
    | 'LAMBDA_SERVICE_REST'
    | 'LAMBDA_SERVICE_WEBSOCKET';
  handler?: string;
  runtime?: string;
  workspaceName?: string;
}
