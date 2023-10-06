const { S3 } = require('aws-sdk');
const sharp = require('sharp');

const s3 = new S3();

// Function to check if the object is an image (png or jpg)
const isImage = (key) => {
    return key.endsWith('.png') || key.endsWith('.jpg') || key.endsWith('.bmp');
};

// Function to resize and convert an image to JPEG
const resizeAndConvertImage = async (imageBuffer) => {
    return sharp(imageBuffer)
        .resize(600, 600)
        .jpeg({ mozjpeg: true })
        .toBuffer();
};

// Function to process the S3 event
exports.handler = async (event) => {
    try {
        console.log('Executed => imagegramPostImageConverterLambda');
        const sourceBucket = event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
        
        console.log('New Image Uploaded => ', key);
        
        // Check if the object is an image
        if (isImage(key)) {
            // Get the object from S3
            const params = {
                Bucket: sourceBucket,
                Key: key
            };
            
            const getObjectResponse = await s3.getObject(params).promise();
            
            // Check the size of the object
            if (getObjectResponse.ContentLength < 100 * 1024 * 1024) {
                // Convert and resize the image
                const resizedImageBuffer = await resizeAndConvertImage(getObjectResponse.Body);
                
                // Upload the converted image to a different bucket
                const targetBucket = 'imagegram-post-images'; // Replace with your target bucket name
                const uploadParams = {
                    Bucket: targetBucket,
                    Key: key.replace(/\.(png|jpg)$/, '.jpg'), // Replace with your desired key
                    Body: resizedImageBuffer
                };
                
                console.log('Image Converted to JPG => ', key);
                await s3.upload(uploadParams).promise();
            }
        }
        
        return 'Function executed successfully';
    } catch (error) {
        console.error('Error:', error);
        throw error; // Rethrow the error for AWS Lambda error handling
    }
};
