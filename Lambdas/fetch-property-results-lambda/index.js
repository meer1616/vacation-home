const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const propertiesTable = process.env.PROPERTIES_TABLE_NAME;
const bookingsTable = process.env.BOOKINGS_TABLE_NAME;

const fetchAllProperties = async () => {
    const params = {
        TableName: propertiesTable
    };

    try {
        const response = await dynamoDb.scan(params).promise();
        return response.Items;
    } catch (err) {
        throw new Error("Error fetching properties");
    }
}

const fetchPropertyByDate = async (searchRequest) => {
    const { check_in, check_out } = searchRequest;
    const params = {
        TableName: bookingsTable
    };

    try {
        const bookingResponse = await dynamoDb.scan(params).promise();
        const bookings = bookingResponse.Items || [];
        const roomsNotAvailable = bookings.map(booking => {
            if ((booking.check_in >= check_in && booking.check_in < check_out) || (booking.check_out > check_in && booking.check_out <= check_out)) {
                return booking.room_id;
            }
        });
        return roomsNotAvailable;
    } catch (err) {
        throw new Error("Error fetching bookings");
    }
}

const fetchAvailableProperties = async (searchRequest) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Content-Type": "application/json"
    };

    try {
        const allProperties = await fetchAllProperties();
        const unavailableRoomIds = await fetchPropertyByDate(searchRequest);

        const availableProperties = allProperties.filter(property => {
            return !unavailableRoomIds.includes(property.id);
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(availableProperties)
        }
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: err.message })
        }
    }
}

exports.handler = async (event, context) => {
    const { check_in, check_out } = JSON.parse(event.body);
    const searchRequest = { check_in, check_out };
    return await fetchAvailableProperties(searchRequest);
}