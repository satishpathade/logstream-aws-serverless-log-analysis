output "api_url" {
  value = aws_api_gateway_stage.dev.invoke_url
}

output "bucket_name" {
  value = aws_s3_bucket.logs.bucket
}

output "table_name" {
  value = aws_dynamodb_table.logs.name
}

output "lambda_name" {
  value = aws_lambda_function.log_analyzer.function_name
}