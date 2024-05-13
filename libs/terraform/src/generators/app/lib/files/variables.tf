# provided by the pipeline in deploy_stage.yml
variable "ENVIRONMENT" {
  type = string
}

variable "ENV_TYPE" {
  type = string
}

variable "BUILD_SOURCES_DIR" {
  type = string
  description = "root level for the project sources"
  default = "<%= localBuildOffset %>"
}
# end provided by pipeline

variable "project_name" {
  type        = string
  description = "name of the main project/monorepo"
  default = "<%= workspaceName %>"
}

variable "application_dir" {
  type = string
  default = "<%= projectName %>"
}
