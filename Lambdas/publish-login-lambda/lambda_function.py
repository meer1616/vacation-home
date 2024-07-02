import json
import boto3

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    

    topic_arn = 'arn:aws:sns:us-east-1:481189138737:UserloginTopic'
    

    # The message you want to send
    message = 'You have successfully login to Dal vacation account.'
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
