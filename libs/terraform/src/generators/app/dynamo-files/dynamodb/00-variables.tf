variable "environment" {
  type = string
}

variable "project_name" {
  type = string
}

variable "application_name" {
  type = string
}

variable "replica_regions" {
  type = any
  description = "Region names for creating replicas for a global DynamoDB table."
  default     = []
}
