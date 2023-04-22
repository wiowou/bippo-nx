module "user-pool" {
  source = "../../../libs/terraform/cognito"

  environment = var.ENVIRONMENT
  project_name = var.project_name
  application_name = var.application_name
}
