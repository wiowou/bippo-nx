export interface TerraformGeneratorSchema {
  name: string;
  tags?: string;
  directory?: string;
  awsProfile: string;
  terraformVersion: string;
  terraformAwsVersion: string;
}
