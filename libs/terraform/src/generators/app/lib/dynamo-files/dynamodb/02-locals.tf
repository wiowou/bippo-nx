locals {
  application_name = replace(var.application_dir, "/", "-")
  fqname   = "${var.project_name}-${local.application_name}-${var.environment}"
  proj_env = "${var.project_name}-${var.environment}"
}