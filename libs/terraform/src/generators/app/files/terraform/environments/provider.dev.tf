# Require TF version
terraform {
  required_version = ">= <%= terraformVersion %>"
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = ">= <%= terraformAwsVersion %>"
    }
  }
  backend "s3" {
    bucket         = "<%= awsAccount %>-terraform-state"
    key            = "<%= projectName %>/dev/terraform.tfstate"
    region         = "us-east-1"
    # dynamodb_table = "tf-locks"
    encrypt        = true
    role_arn = "arn:aws:iam::<%= awsAccount %>:role/DevOpsIamRole"
  }
}

# default provider
provider "aws" {
  region  = "us-east-1"
  assume_role {
    role_arn = "arn:aws:iam::<%= awsAccount %>:role/DevOpsIamRole"
  }
}