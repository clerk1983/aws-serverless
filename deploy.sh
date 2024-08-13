#!bin/bash

echo "-- SAM BUILD & DEPLOY ----------"
sam build
sam deploy

echo ""
echo "-- S3 SYNC ---------------------"
echo $(aws s3 sync ./frontend/static/ s3://aws-serverless-frontend-s3-ap-northeast-1-465068362057 --delete)
echo ""
