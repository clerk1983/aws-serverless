#!bin/bash

echo ""
echo "-- OPEN-API S3 SYNC ---------------------"
echo $(aws s3 sync ./doc s3://aws-serverless-backend-s3-ap-northeast-1-465068362057/doc --delete)
echo ""

echo "-- MPM BUILD (WEBPACK)----------"
npm run build

echo "-- SAM BUILD & DEPLOY ----------"
sam build
sam deploy

echo ""
echo "-- FRONT-END S3 SYNC ---------------------"
echo $(aws s3 sync ./frontend/static/ s3://aws-serverless-frontend-s3-ap-northeast-1-465068362057 --delete)
echo ""
