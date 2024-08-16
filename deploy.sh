#!bin/bash

echo "-- MPM BUILD (WEBPACK)----------"
npm run build

echo "-- SAM BUILD & DEPLOY ----------"
sam build
sam deploy

echo ""
echo "-- FRONT-END S3 SYNC ---------------------"
echo $(aws s3 sync ./packages/frontend/static/ s3://aws-serverless-frontend-s3-ap-northeast-1-465068362057 --delete)
echo ""
