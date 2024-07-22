const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME || "Users";

const getDataFromDynamoDB = async (email) => {
    const params = {
        TableName: tableName,
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
            ':email': email
        },
        Limit: 1,
        ScanIndexForward: false
    };

    try {
        const userData = await dynamodb.query(params).promise();
        return userData.Items[0];
    } catch (err) {
        console.log(err);
        return null;
    }
}

const fetchUserData = async (email) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Content-Type": "application/json"
    };

    if (!email) {
        return {
            statusCode: 400,
            headers: headers,
            body: JSON.stringify({ message: "Email is required" })
        };
    }

    try {
        const userData = await getDataFromDynamoDB(email);
        if (!userData) {
            return {
                statusCode: 404,
                headers: headers,
                body: JSON.stringify({ message: "User not found" })
            };
        }

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(userData)
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({ message: "Internal Server Error" })
        };

    }
}

exports.handler = async (event, context) => {
    const { email } = JSON.parse(event.body);
    return await fetchUserData(email);
};
