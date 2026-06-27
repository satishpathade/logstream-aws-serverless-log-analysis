resource "aws_cloudwatch_log_group" "logstream" {
  name = "/aws/lambda/logstream-analyzer"

  retention_in_days = 14

  tags = {
    Name        = "logstream-cloudwatch"
    Project     = var.project_name
  }
}