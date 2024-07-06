import json
import boto3
import os

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    userId = event.get('userId')    
    
    if not userId:
        return {
            'statusCode': 400,
            'body': json.dumps('No userId provided')
        }
    
    # Access the environment variable
    sns_arn_prefix = os.environ.get('SNS_ARN_PREFIX')
    if not sns_arn_prefix:
        return {
            'statusCode': 500,
            'body': json.dumps('SNS ARN prefix not set')
        }

    topic_arn = f'{sns_arn_prefix}{userId}_usertopic'

    # The message you want to send
    message = 'You have successfully logged into Dal vacation account.'
    subject = 'Login successful'

    sns_client.publish(
        TopicArn=topic_arn,
        Message=message,
        Subject=subject,
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps('Message sent to email addresses successfully')
    }
