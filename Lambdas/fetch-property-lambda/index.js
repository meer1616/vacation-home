const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.PROPERTY_TABLE_NAME || 'PropertyListings';

const fetchProperty = async (id) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Content-Type": "application/json"
    };

    const params = {
        TableName: tableName,
        Key: {
            id: id
        }
    };

    try {
        const property = await dynamodb.get(params).promise();
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(property.Item)
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Failed to fetch property' })
        }
    }
}

exports.handler = async (event, context) => {
    const { id } = JSON.parse(event.body);
    return await fetchProperty(id);
}