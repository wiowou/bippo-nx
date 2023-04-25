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
    profile = "<%= awsProfile %>"
  }
}

# default provider
provider "aws" {
  region  = "us-east-1"
  profile = "<%= awsProfile %>"
}