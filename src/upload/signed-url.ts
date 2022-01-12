///import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
///import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import fetch from 'node-fetch';

///const REGION = 'us-west-2';
const BUCKET = 'trash.dev.lfm.west';
///const KEY_PREFIX = 'gmt'; // 'bulk_tagging_job';
///const s3Client = new S3Client({ region: REGION });

// Set parameters
// Create a random names for the Amazon Simple Storage Service (Amazon S3) bucket and key
export const bucketParams = {
    Bucket: BUCKET,
    //Key: `${KEY_PREFIX}/test`,
    Key: 'bulk_tagging_job_upload/1642015885.7449553',
    Body: 'asdf',
};

export const uploadFileViaSignedUrl = async () => {
    try {
        // Create the command.
        ///const command = new PutObjectCommand(bucketParams);

        // Create the presigned URL.
        //const signedUrl = await getSignedUrl(s3Client, command, {
        //expiresIn: 3600,
        //});
        const signedUrl =
            'https://s3.us-west-2.amazonaws.com/trash.dev.lfm.west/bulk_tagging_job_upload/1642015885.7449553?X-Amz-Algorithm=AWS4-HMAC-SHA256\u0026X-Amz-Credential=ASIAZWUJ2ZI7VZCXABEU%2F20220112%2Fus-west-2%2Fs3%2Faws4_request\u0026X-Amz-Date=20220112T193126Z\u0026X-Amz-Expires=30000\u0026X-Amz-Security-Token=IQoJb3JpZ2luX2VjEDQaCXVzLWVhc3QtMSJIMEYCIQCoSNcLDtiV%2BecTRsy6HPZirjMKWUpyQFUf3VW%2FVnzuwAIhAPEQz4gXzkxitu3GqW0oa2AVz%2BRuDTM1QHmDw%2BCIAghJKqoDCE0QABoMNjY3MDgyNzM4MjM5Igzz2uXw%2FqWXEszWLR4qhwMo4drp0uxTzO2BLabeNq%2BfQCrokOZQYJm7bMCjjRtZYw5ll%2Fl%2Fjzs9dW5By5pCe0NJfkCta6ZnSy9gjLWDi3I1NITgeA7qTnVdPm7DGDbzY9QvXoP8pb0wyQ8vaxQMdD6vAkFxLGj8wUsUD%2BzFh%2BpOdYmBrYopqb4tCHg5VFA8GImXbUoZMSDH9kuqaIx51iTyZeWCQpqHhkLT2nQ1PFtCI3bw9dKPWGBUktjJ0DW09TQgGMNgX3LMlJ8SFWHSIremCtcFGS9Zf4J4IwdlN%2B2c8SKKvhex6NeS8gX9EPwYrFL%2FOXr3uGlML%2FZgwkh05hTk2bAfZWmkn1PISnfTVnRmImaHK7toSXStGf6UWXYzMo2JEfk052dJFVJXguyw2dhLgF9HFYOzPkrPaK4nr%2B1Sy8jrz2tl9KUVkDXaR78Yi6D7WsWSiWLpd98c5HSBNvZmBdfQX8yO9wzz7nfgNUXdye331NSbtTYDtOoTFdwCOtBN2rxVc0ifxinACBN6UiQMcXFy4j6PMI3Z%2FI4GOqUBdgipzJvv7AV434ZkPT0fLCVdcUQJAe6Ifa5KqXe79YHHh5CarQV%2BpOKLzCziV0kKTwrqgrEVoNx4J5FTjYjSlwkyuc1brFUEnSLufuordIFDV%2FBNwzytolg%2B3GxnvDyDqn93zoD26iV%2FiTnCPwD09OxCmC7vd10xLFH4eAT%2F8OvbAjbMFSxbu2doN6qRLXK0S49JqSSQyl%2FRmwk66CfqtQo2NMWJ\u0026X-Amz-SignedHeaders=host\u0026X-Amz-Signature=6806d943b74791167af13412fc8f891a6d92274e2407b4176bccb0c5e475f8d6';
        this.log(
            `\nPutting "${bucketParams.Key}" using signedUrl with body "${bucketParams.Body}" in v3`
        );
        this.log(signedUrl);
        const response = await fetch(signedUrl);
        this.log(
            `\nResponse returned by signed URL: ${await response.text()}\n`
        );
        return response;
    } catch (error) {
        this.log('Error creating presigned URL', error);
    }
};
//run();
