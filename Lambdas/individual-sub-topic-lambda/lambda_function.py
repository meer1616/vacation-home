import json
import boto3

def lambda_handler(event, context):
    sns_client = boto3.client('sns')
    
    # Extract email address and userId from the event payload
    email_address = event.get('email')
    userId = event.get('userId')
    
    if not email_address:
        return {
            'statusCode': 400,
            'body': json.dumps('No email address provided')
        }
    
    if not userId:
        return {
            'statusCode': 400,
            'body': json.dumps('No userId provided')
        }
    
    # Create a new SNS topic with combined string
    topic_name = "userlogintopic"
    combined_string = f"{userId}_{topic_name}"
    
    create_topic_response = sns_client.create_topic(Name=combined_string)
    topic_arn = create_topic_response['TopicArn']
    
    # Subscribe the email to the SNS topic
    sns_client.subscribe(
        TopicArn=topic_arn,
        Protocol='email',
        Endpoint=email_address
    )
    
    # Publish a test message to the SNS topic
    message = 'You are successfully subscribed to the SNS topic!'
    subject = 'Subscription Confirmation'
    
    sns_client.publish(
        TopicArn=topic_arn,
        Message=message,
        Subject=subject
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps(f'Topic {combined_string} created and email subscription added successfully')
    }
