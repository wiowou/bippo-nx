# provided by the pipeline in deploy_stage.yml
variable "ENVIRONMENT" {
  type = string
}

variable "BUILD_SOURCES_DIR" {
    type = string
    description = "root level for the project sources"
    default = "<%= rootOffset %>../"
}
# end provided by pipeline

variable "application_name" {
  type = string
}

variable "region" {
  type = string
  default = "us-east-1"
}



