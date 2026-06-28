variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project Name"
  type        = string
  default     = "logstream"
}

variable "bucket_name" {
  description = "Frontend S3 Bucket Name"
  type        = string
}

variable "lambda_zip" {
  description = "Lambda deployment package"
  type        = string
  default     = "../lambda/lambda.zip"
}

variable "lambda_function_name" {
  description = "Lambda Function Name"
  type        = string
  default     = "logstream-processor"
}

variable "dynamodb_table_name" {
  description = "DynamoDB Table Name"
  type        = string
  default     = "logstream-log"
}
