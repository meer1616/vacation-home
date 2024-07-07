const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const reviewsTable = process.env.REVIEWS_TABLE_NAME;

const fetchReviews = async (room_id) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Content-Type": "application/json"
    };

    const params = {
        TableName: reviewsTable
    }

    try {
        const response = await dynamodb.scan(params).promise();
        const reviews = response.Items || [];

        const roomReviews = reviews.filter(review => {
            return review.room_id === room_id;
        });
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(roomReviews)
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: "Error fetching reviews" })
        }
    }
}

exports.handler = async (event, context) => {
    const { room_id } = JSON.parse(event.body);
    return await fetchReviews(room_id);
}