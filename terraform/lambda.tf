# Lambda Function
resource "aws_lambda_function" "log_processor" {
  function_name = var.lambda_function_name
  filename         = var.lambda_zip
  source_code_hash = filebase64sha256(var.lambda_zip)
  role = aws_iam_role.lambda_role.arn
  handler = "lambda_function.lambda_handler"
  runtime = "python3.13"
  timeout = 30
  memory_size = 256
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.logs.name
    }
  }
  tags = {
    Name = "${var.project_name}-lambda"
    Project = var.project_name
  }
}

# Lambda Permission
resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id = "AllowExecutionFromCloudWatch"
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.log_processor.function_name
  principal = "logs.amazonaws.com"
}
