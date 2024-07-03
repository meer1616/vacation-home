import json
import boto3

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    userId = event.get('userId')    
    
    if not userId:
        return {
            'statusCode': 400,
            'body': json.dumps('No userId provided')
        }
        
    topic_arn = f'arn:aws:sns:us-east-1:481189138737:{userId}_userlogintopic'
    

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
