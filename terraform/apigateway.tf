# ```hcl
# ############################################
# # API Gateway REST API
# ############################################

# resource "aws_api_gateway_rest_api" "logstream" {

#   name        = "${var.project_name}-api"
#   description = "LogStream REST API"

# }

# ############################################
# # /logs Resource
# ############################################

# resource "aws_api_gateway_resource" "logs" {

#   rest_api_id = aws_api_gateway_rest_api.logstream.id

#   parent_id = aws_api_gateway_rest_api.logstream.root_resource_id

#   path_part = "logs"

# }

# ############################################
# # GET Method
# ############################################

# resource "aws_api_gateway_method" "get_logs" {

#   rest_api_id = aws_api_gateway_rest_api.logstream.id

#   resource_id = aws_api_gateway_resource.logs.id

#   http_method = "GET"

#   authorization = "NONE"

# }

# ############################################
# # Lambda Integration
# ############################################

# resource "aws_api_gateway_integration" "get_logs" {

#   rest_api_id = aws_api_gateway_rest_api.logstream.id

#   resource_id = aws_api_gateway_resource.logs.id

#   http_method = aws_api_gateway_method.get_logs.http_method

#   integration_http_method = "POST"

#   type = "AWS_PROXY"

#   uri = aws_lambda_function.log_processor.invoke_arn

# }

# ############################################
# # Deployment
# ############################################

# resource "aws_api_gateway_deployment" "deployment" {

#   depends_on = [
#     aws_api_gateway_integration.get_logs
#   ]

#   rest_api_id = aws_api_gateway_rest_api.logstream.id

# }

# ############################################
# # Stage
# ############################################

# resource "aws_api_gateway_stage" "dev" {

#   rest_api_id = aws_api_gateway_rest_api.logstream.id

#   deployment_id = aws_api_gateway_deployment.deployment.id

#   stage_name = "dev"

# }

# ############################################
# # Allow API Gateway to Invoke Lambda
# ############################################

# resource "aws_lambda_permission" "allow_apigateway" {

#   statement_id = "AllowExecutionFromAPIGateway"

#   action = "lambda:InvokeFunction"

#   function_name = aws_lambda_function.log_processor.function_name

#   principal = "apigateway.amazonaws.com"

#   source_arn = "${aws_api_gateway_rest_api.logstream.execution_arn}/*/*"

# }