const AWS = require("aws-sdk");
const { CognitoUserAttribute, CognitoUserPool } = require('amazon-cognito-identity-js');
const { v4: uuidv4 } = require('uuid');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const poolData = {
  UserPoolId: process.env.USER_POOL_ID,
  ClientId: process.env.CLIENT_ID,
};

const getCognitoPool = () => new CognitoUserPool(poolData);

const getDataFromDynamoDB = async (email) => {
  const params = {
    TableName: 'Users',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': email
    },
    ProjectionExpression: 'securityQuestion',
    Limit: 1,
    ScanIndexForward: false
  };
  
  const data = await dynamoDB.query(params).promise();
  return data.Items;
}

exports.handler = async (event) => {
  try {
    const { email, firstName, lastName, password, address, phoneNumber, isAdmin = false, securityAnswer, securityQuestion } = event;

    if (!email || !firstName || !lastName || !password || !address || !phoneNumber || !securityQuestion || !securityAnswer) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const attributeList = [
      new CognitoUserAttribute({
        Name: "email",
        Value: email,
      }),
      new CognitoUserAttribute({
        Name: "custom:role",
        Value: isAdmin ? 1 : 0,
      }),
      new CognitoUserAttribute({
        Name: "name",
        Value: firstName + " " + lastName,
      })
    ]

    try {
      const userData = await getDataFromDynamoDB(email)
      if (userData && userData.length > 0) {
        return {
          statusCode: 500,
          success: false,
          message: "User is already present"
        };
      }
      await getCognitoPool().signUp(email, password, attributeList, null);
    }
    catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        success: false,
        message: "Registration Failed. Please try again"
      };
    }

    const userId = uuidv4();
    const lastLoginAt = new Date().toISOString();
    const params = {
      TableName: "Users",
      Item: {
        userId,
        email,
        firstName,
        lastName,
        phoneNumber,
        address,
        isAdmin,
        securityAnswer,
        securityQuestion,
        lastLoginAt
      },
    };

    await dynamoDB.put(params).promise();
    
    return {
      userId,
      email,
      statusCode: 200,
      success: true,
      message: "User registered successfully",
    };
  }
  catch (error) {
    console.log(error)
    return {
      email,
      statusCode: 500,
      success: false,
      message: "Could not register user",
      userId: null,
      error
    };
  }
};
