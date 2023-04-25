module "user-pool" {
  source = "<%= rootOffset %>../libs/terraform/cognito"

  environment = var.ENVIRONMENT
  project_name = var.project_name
  application_name = var.application_name
}
