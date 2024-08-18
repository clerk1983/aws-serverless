# Reverse game by AWS Serverless

[![Deploy to AWS](https://github.com/clerk1983/aws-serverless/actions/workflows/sam-deploy.yaml/badge.svg)](https://github.com/clerk1983/aws-serverless/actions/workflows/sam-deploy.yaml)

## Webapp

[Webapp](http://aws-serverless-frontend-s3-ap-northeast-1-465068362057.s3-website-ap-northeast-1.amazonaws.com/)

### Delete Stack

```bash
aws cloudformation delete-stack --stack-name aws-serverless
aws cloudformation describe-stacks --stack-name aws-serverless
```

DynamoDB local への疎通確認例

```bash
curl -X POST http://localhost:8000 \
-H "Content-Type: application/x-amz-json-1.0" \
-H "X-Amz-Target: DynamoDB_20120810.ListTables" \
-H "Authorization: AWS4-HMAC-SHA256 Credential=dummy/20200830/us-west-2/dynamodb/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-target, Signature=dummy" \
-H "x-amz-date: $(date -u +%Y%m%dT%H%M%SZ)" \
-d '{}'
```
