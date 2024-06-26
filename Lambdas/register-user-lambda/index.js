const AWS = require("aws-sdk");
const { CognitoUserAttribute, CognitoUserPool } = require('amazon-cognito-identity-js');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const poolData = {
  UserPoolId: process.env.USER_POOL_ID,
  ClientId: process.env.CLIENT_ID,
};

const getCognitoPool = () => new CognitoUserPool(poolData);

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
      await getCognitoPool().signUp(email, password, attributeList, null);
    }
    catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        success: false,
        message: "User is already present"
      };
    }

    const params = {
      TableName: "Users",
      Item: {
        email,
        firstName,
        lastName,
        phoneNumber,
        address,
        isAdmin,
        securityAnswer,
        securityQuestion
      },
    };
  
    await dynamoDB.put(params).promise();
    return {
      statusCode: 200,
      success: true,
      message: "User registered successfully"
    };
  }
  catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      success: false,
      message: "Could not register user",
      error
    };
  }
};
  