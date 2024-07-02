import json
import boto3

def lambda_handler(event, context):
    sns_client = boto3.client('sns')

    print(event)
    topic_arn = 'arn:aws:sns:us-east-1:481189138737:UserloginTopic'  # Replace with your SNS topic ARN
    email_address = event.email  # Replace with the recipient email address

    # Subscribe email to SNS topic
    response = sns_client.subscribe(
        TopicArn=topic_arn,
        Protocol='email',
        Endpoint=email_address
    )

    subscription_arn = response['SubscriptionArn']

    # Publish a message to SNS topic
    sns_client.publish(
        TopicArn=topic_arn,
        Message=f'You have been subscribed to the topic: {topic_arn}. Subscription ARN: {subscription_arn}',
        Subject='Subscription Confirmation'
    )

    return {
        'statusCode': 200,
        'body': json.dumps('Subscription and email sent successfully')
    }
