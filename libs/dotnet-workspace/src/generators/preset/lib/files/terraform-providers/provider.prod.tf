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
    key            = "<%= name %>/{args.projectKey}/prod/terraform.tfstate"
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

provider "aws" {
  alias   = "us-east-2"
  region  = "us-east-2"
  assume_role {
    role_arn = "arn:aws:iam::<%= awsAccount %>:role/DevOpsIamRole"
  }
}

provider "aws" {
  alias   = "us-west-1"
  region  = "us-west-1"
  assume_role {
    role_arn = "arn:aws:iam::<%= awsAccount %>:role/DevOpsIamRole"
  }
}

provider "aws" {
  alias   = "us-west-2"
  region  = "us-west-2"
  assume_role {
    role_arn = "arn:aws:iam::<%= awsAccount %>:role/DevOpsIamRole"
  }
}