import { TerraformOptions } from '@bippo-nx/terraform';

interface NormalizedStepFunctionGeneratorSchema extends StepFunctionGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  rootOffset: string;
  workspaceName: string;
}

export interface StepFunctionGeneratorSchema extends TerraformOptions {
  name: string;
  directory?: string;
  lambda?: string;
}
