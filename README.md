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
aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-west-2
```
