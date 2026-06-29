import json
import gzip
import base64
import boto3
import os
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
TABLE_NAME = os.environ["TABLE_NAME"]
table = dynamodb.Table(TABLE_NAME)

def lambda_handler(event, context):

    # Decode CloudWatch Logs payload
    compressed_payload = base64.b64decode(event["awslogs"]["data"])
    uncompressed_payload = gzip.decompress(compressed_payload)
    log_data = json.loads(uncompressed_payload)

    # CloudWatch Log Group
    log_group = log_data.get("logGroup", "Unknown")

    for log_event in log_data["logEvents"]:

        message = log_event["message"].strip()

        # Detect Log Level
        if message.startswith("ERROR"):
            level = "ERROR"
        elif message.startswith("WARNING"):
            level = "WARNING"
        elif message.startswith("CRITICAL"):
            level = "CRITICAL"
        else:
            level = "INFO"

        clean_message = message.split(" ", 1)[1] if " " in message else message

        # Store log in DynamoDB
        table.put_item(
            Item={
                "log_id": log_event["id"],
                "timestamp": datetime.fromtimestamp(
                    log_event["timestamp"] / 1000
                ).strftime("%Y-%m-%d %H:%M:%S"),
                "source": log_group,
                "level": level,
                "category": "Unknown",
                "message": clean_message
            }
        )

        print(f"Stored Log: {clean_message}")

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Logs stored successfully"
        })
    }