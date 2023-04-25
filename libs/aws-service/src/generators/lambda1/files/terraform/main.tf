module "lambda-service" {
    source = "<%= rootOffset %>../libs/terraform/api-gateway-v1-lambda"

    environment = var.ENVIRONMENT
    project_name = var.project_name
    application_name = var.application_name
    BUILD_SOURCES_DIR = var.BUILD_SOURCES_DIR
    use_auth = true
}