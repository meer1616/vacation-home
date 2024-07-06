const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { v4: uuidv4 } = require("uuid");

const snsClient = new SNSClient({ region: 'us-east-1' });
const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });

const topicArn = process.env.TOPIC_ARN || 'arn:aws:sns:us-east-1:481189138737:';

exports.handler = async (event) => {
    console.log("Event: ", event);

    for (const record of event.Records) {
        console.log("record", record);

        const bookingDetails = JSON.parse(record.body);
        let isBookingApproved;

        if (!bookingDetails.check_in || !bookingDetails.check_out || !bookingDetails.number_of_people || !bookingDetails.first_name || !bookingDetails.last_name || !bookingDetails.room_id || !bookingDetails.email || !bookingDetails.room_number || !bookingDetails.userId) {
            isBookingApproved = false;
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Your booking could not be processed due to missing required fields.' })
            };
        }

        try {
            const reservationId = uuidv4();

            const reservationParams = {
                TableName: process.env.TABLE_NAME || 'roombooking',
                Item: {
                    bookingRef: { S: reservationId },
                    check_in: { S: bookingDetails.check_in },
                    check_out: { S: bookingDetails.check_out },
                    number_of_people: { N: bookingDetails.number_of_people.toString() },
                    first_name: { S: bookingDetails.first_name },
                    last_name: { S: bookingDetails.last_name },
                    room_id: { S: bookingDetails.room_id },
                    email: { S: bookingDetails.email },
                    room_number: { S: bookingDetails.room_number },
                    userId: { S: bookingDetails.userId },
                    createdAt: { S: new Date().toISOString() },
                    updatedAt: { S: new Date().toISOString() },
                },
            };

            console.log("reser", JSON.stringify(reservationParams, null, 2));

            const putCommand = new PutItemCommand(reservationParams);
            await dynamoDbClient.send(putCommand);
            isBookingApproved = true;
            console.log('Reservation saved to DynamoDB successfully');
        } catch (error) {
            console.error('Error saving reservation to DynamoDB', error);
            isBookingApproved = false;
        }

        const subject = isBookingApproved ? 'Booking Confirmation' : 'Booking Failure';
        const message = isBookingApproved
            ? `Your booking of room number ${bookingDetails.room_number} has been confirmed. Your reservationId is ${reservationId}`
            : 'Your booking could not be processed.';

        const params = {
            Message: message,
            Subject: subject,
            TopicArn: topicArn + bookingDetails.userId + "_userlogintopic",
            MessageAttributes: {
                'email': {
                    DataType: 'String',
                    StringValue: bookingDetails.userId
                }
            }
        };

        try {
            const command = new PublishCommand(params);
            await snsClient.send(command);
            console.log('Notification sent successfully');
        } catch (error) {
            console.error('Error sending notification', error);
        }
    }
};
