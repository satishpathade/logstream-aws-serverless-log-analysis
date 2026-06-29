# DynamoDB Table
resource "aws_dynamodb_table" "logs" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "log_id"
  attribute {
    name = "log_id"
    type = "S"
  }

  tags = {
    Name        = "${var.project_name}-logs"
    Project     = var.project_name
  }
}
