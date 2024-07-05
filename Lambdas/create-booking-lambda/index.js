const { nanoid } = require('nanoid');
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

const checkIfBookingExists = async (room_id, check_in, check_out) => {
    const params = {
        TableName: tableName
    }

    try {
        const response = await dynamodb.scan(params).promise();
        const bookings = response.Items || [];
        const clash = bookings.filter(booking => {
            return booking.room_id === room_id && (booking.check_in < check_out || booking.check_out > check_in);
        });
        return clash.length > 0;
    } catch (err) {
        throw new Error("Error checking if booking exists");
    }
}

const generateBookingId = () => {
    return nanoid(7);
}

const isValidBookingObject = (bookingObject) => {
    if (!bookingObject
        || !bookingObject.check_in
        || !bookingObject.check_out
        || !bookingObject.number_of_people
        || !bookingObject.first_name
        || !bookingObject.last_name
        || !bookingObject.room_id
        || !bookingObject.email) {
        return {
            isValid: false,
            message: "Missing required fields"
        };
    }

    if (bookingObject.check_in >= bookingObject.check_out) {
        return false;
    }

    return true;
}

const createBooking = async (bookingObject) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Content-Type": "application/json"
    };

    try {
        if (!isValidBookingObject(bookingObject)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: "Invalid fields" })
            };
        }

        const doesBookingExist = await checkIfBookingExists(bookingObject.room_id, bookingObject.check_in, bookingObject.check_out);
        if (doesBookingExist) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: "Booking already exists for this room during this time" })
            };
        }

        const bookingRef = generateBookingId();
        const params = {
            TableName: tableName,
            Item: {
                bookingRef: bookingRef,
                check_in: bookingObject.check_in,
                check_out: bookingObject.check_out,
                number_of_people: bookingObject.number_of_people,
                first_name: bookingObject.first_name,
                last_name: bookingObject.last_name,
                room_id: bookingObject.room_id,
                email: bookingObject.email
            }
        }

        await dynamodb.put(params).promise();
        return {
            statusCode: 201,
            headers,
            body: JSON.stringify({ message: "Booking created successfully" })
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: err.message })
        };
    }
}

exports.handler = async (event, context) => {
    const { check_in, check_out, number_of_people, first_name, last_name, room_id, email } = JSON.parse(event.body);
    const bookingObject = { check_in, check_out, number_of_people, first_name, last_name, room_id, email };
    return await createBooking(bookingObject);
}