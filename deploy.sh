#!bin/bash

sam build
sam deploy

echo $(aws s3 sync ./frontend/static/ s3://aws-serverless-frontend-s3-ap-northeast-1-465068362057 --delete)
