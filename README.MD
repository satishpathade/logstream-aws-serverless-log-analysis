# LogStream - AI Powered AWS Serverless Log Analysis

## Overview

LogStream is a serverless log analysis platform built on AWS. It collects application logs, processes them with AWS Lambda, stores them in Amazon DynamoDB, and visualizes them through a web dashboard.

The project is designed to evolve into an AI-powered observability platform capable of automatically analyzing logs, identifying root causes, detecting anomalies, and providing remediation suggestions.

---

## Architecture

**CloudWatch - Lambda (Log Processor) - DynamoDB - Lambda (API) - API Gateway - S3 Static Website**

## Features

- Collects application and service logs from Amazon CloudWatch Logs
- Processes log events using AWS Lambda
- Stores structured log data in Amazon DynamoDB
- Serverless architecture for scalable log processing
- Automated log ingestion pipeline
- Categorizes logs by severity level (INFO, WARNING, ERROR, CRITICAL)
- Centralized log storage for analysis and retrieval
- Infrastructure fully managed using Terraform
- Secure access management with AWS IAM
- Static web dashboard hosted on Amazon S3

## Tech Stack

### AWS Services

| Service | Purpose |
|---------|---------|
| **Amazon S3** | Hosts the static frontend and stores website assets |
| **AWS Lambda** | Processes CloudWatch logs and powers backend APIs |
| **Amazon DynamoDB** | Stores structured log data for analysis and retrieval |
| **Amazon CloudWatch Logs** | Collects application and service logs that trigger Lambda processing |
| **Amazon API Gateway** | Exposes REST APIs for the frontend to retrieve logs |
| **AWS IAM** | Manages roles and permissions for Lambda and other AWS resources |

### Application Layer

| Layer | Technology |
|---------|---------|
| Frontend | HTML5, CSS3, JavaScript (ES6), Chart.js |
| AI (Planned)Amazon Bedrock / OpenAI API |

## Future Improvements

- AI-powered log summarization
- Intelligent log categorization
- Root cause analysis
- Anomaly detection
- Severity prediction
- Failure pattern recognition
- AI-generated remediation recommendations
- Natural language log search
- AI-powered incident insights
- Amazon Bedrock / OpenAI integration

---

## Author

**Satish Pathade**  
AWS Cloud & DevOps Engineer  
Email: [pathadesatish0@gmail.com](mailto:pathadesatish0@gmail.com)