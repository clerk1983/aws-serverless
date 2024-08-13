#!bin/bash

echo "-- SAM BUILD & DEPLOY ----------"
sam build
sam deploy

echo ""
echo "-- FRONT-END S3 SYNC ---------------------"
echo $(aws s3 sync ./frontend/static/ s3://aws-serverless-frontend-s3-ap-northeast-1-465068362057 --delete)
echo ""

aws apigateway get-export --rest-api-id 8bgmut0ajj --stage-name Prod --export-type oas30 --accepts application/yaml  open-api.yaml
