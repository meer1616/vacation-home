const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({ region: 'us-east-1' });
const queueUrl = process.env.QUEUE_URL;

exports.handler = async (event) => {

    console.log("Event: ", event);
    const bookingDetails = event;
    console.log("Bookingdetails: ", bookingDetails);

    const params = {
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(bookingDetails)
    };

    try {
        const command = new SendMessageCommand(params);
        await sqsClient.send(command);
        console.log('Booking request added to SQS queue.');
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Booking request added to SQS queue.' }),
        };
    } catch (error) {
        console.error('Error adding booking request to SQS queue.', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error adding booking request to SQS queue.' }),
        };
    }
};