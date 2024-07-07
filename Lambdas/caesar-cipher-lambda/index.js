const jwt = require('jsonwebtoken');
const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const updateLoginTimeInDynamoDB = async (email) => {
    try {
        const lastLoginAt = new Date().toISOString();
        const params = {
            TableName: 'Users',
            Key: {
                'email': email
            },
            UpdateExpression: 'SET lastLoginAt = :lastLoginAt',
            ExpressionAttributeValues: {
                ':lastLoginAt': lastLoginAt
            },
            ReturnValues: 'UPDATED_NEW'
        };
        await dynamoDB.update(params).promise();
    } catch(error) {
        return error
    }
}

const getDataFromDynamoDB = async (email) => {
    try {
        const params = {
            TableName: 'Users',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
              ':email': email
            },
            Limit: 1,
            ScanIndexForward: false
        };
        
        const data = await dynamoDB.query(params).promise();
        return data.Items;
    }
    catch(error) {
        return error;
    }
}

const generateJWTToken = async (email) => {
    try {
        const [userData] = await getDataFromDynamoDB(email);
        const token = await jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: userData
        }, process.env.JWT_SECRET);
        return { token, userId: userData.userId, email: userData.email };
    } catch(error) {
        console.log(error)
        return error
    }
}

exports.handler = async (event) => {
    const { action, data } = event
    
    if (!action) {
        return {
            statusCode: 400,
            success: false,
            error: "Missing required fields"
        };
    }

    if (action.toLowerCase() == "generate") {
        const key = Math.floor(Math.random() * 9) + 1
        return {
            statusCode: 200,
            success: true,
            data: {
                key,
                cipherText: caesarEncrypt(generateRandomPlainText(4), key),
            }
        }
    } else if (action.toLowerCase() == "verify") {
        const { key, cipherText, plainText, email } = data
        const expectedPlainText = caesarDecrypt(cipherText, key)
        if (expectedPlainText.toLowerCase() == plainText.toLowerCase()) {
            try {
                const userData = await generateJWTToken(email)
                await updateLoginTimeInDynamoDB(email)
                return {
                    ...userData,
                    statusCode: 200,
                    success: true,
                    data: "Verified Successfully"
                };
            } catch(error) {
                return {
                    statusCode: 500,
                    success: false,
                    data: "Failed to generate JWT Token"
                }
            }
        } else {
            return {
                statusCode: 200,
                success: false,
                data: "Verification Failed"
            }; 
        }
    } else {
        return {
            statusCode: 400,
            success: false,
            error: "Action not valid"
        };
    }
};

function caesarEncrypt(plaintext, shift) {
    const length = characters.length;
    shift = shift % length;

    const encryptedText = plaintext.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            const originalIndex = characters.indexOf(char);
            const shiftedIndex = (originalIndex + shift) % length;
            return characters[shiftedIndex];
        }
        return char;
    }).join('');

    return encryptedText;
}

function caesarDecrypt(ciphertext, shift) {
    const length = characters.length;
    shift = shift % length;

    const decryptedText = ciphertext.split('').map(char => {
        if (char.match(/[A-Z]/)) {
            const shiftedIndex = (characters.indexOf(char) - shift + length) % length;
            return characters[shiftedIndex];
        }
        return char;
    }).join('');

    return decryptedText;
}

function generateRandomPlainText(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
