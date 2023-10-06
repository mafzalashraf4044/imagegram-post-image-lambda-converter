# Imagegram Post Image Converter Lambda

This AWS Lambda function, created using AWS SAM (Serverless Application Model), is designed to convert and resize uploaded images in `imagegram-post-original-images` S3 bucket. It checks for new image objects in the source bucket, processes them if they are valid images (jpg, png, bmp), and then uploads the converted images to target S3 bucket i.e `imagegram-post-images`.

## Prerequisites

Before deploying and using this Lambda function, ensure you have the following prerequisites:

1. AWS CLI installed and configured with the necessary credentials.
2. Node.js and npm installed locally.
3. AWS SAM CLI installed locally.

## Deployment

Follow these steps to deploy the Lambda function:

1. Clone this repository to your local machine.
2. Install depenencies by running the following command in the project directory:

   ```bash
   npm install --arch=x64 --platform=linux sharp
   ```
3. Package the Lambda function using AWS SAM:

   ```bash
   sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket imagegram-post-image-converter-lambda-deployement
   ```
4. Deploy the Lambda function using AWS SAM:

   ```bash
   sam deploy --template-file packaged.yaml --stack-name imagegram-post-image-converter-lambda-stack --capabilities CAPABILITY_IAM
   ```

## Usage

Once the Lambda function is deployed, it will be triggered automatically when new image objects (png, jpg, or bmp) are uploaded to the specified source S3 bucket.

### IAM Role

Ensure that the IAM role assigned to the Lambda function has permissions to access the source and target S3 buckets and any other necessary resources.

## Monitoring

You can monitor the execution of your Lambda function using AWS CloudWatch Logs for troubleshooting and performance analysis.

## Cleanup

To remove the deployed Lambda function and associated resources, you can delete the AWS CloudFormation stack using the following AWS CLI command:

```bash
aws cloudformation delete-stack --stack-name imagegram-post-image-converter-lambda-stac
```
