locals {
  fqname   = "${var.project_name}-${var.application_name}-${var.environment}"
  proj_env = "${var.project_name}-${var.environment}"
}