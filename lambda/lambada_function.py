import json
import gzip
import base64
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("logstream-log")


def lambda_handler(event, context):

    compressed_payload = base64.b64decode(event["awslogs"]["data"])
    uncompressed_payload = gzip.decompress(compressed_payload)
    log_data = json.loads(uncompressed_payload)

    for log_event in log_data["logEvents"]:

        message = log_event["message"]

        # log level
        if message.startswith("ERROR"):
            level = "ERROR"
        elif message.startswith("WARNING"):
            level = "WARNING"
        else:
            level = "INFO"

        clean_message = message.split(" ", 1)[1] if " " in message else message

        table.put_item(
            Item={
                "log_id": log_event["id"],
                "timestamp": str(log_event["timestamp"]),
                "source": "test",
                "level": level,
                "category": "Unknown",
                "message": clean_message
            }
        )

        print(f"Stored Log: {clean_message}")

    return {
        "statusCode": 200,
        "body": "Logs stored successfully"
    }