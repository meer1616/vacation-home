const AWS = require("aws-sdk");
const { CognitoUserPool, AuthenticationDetails, CognitoUser } = require('amazon-cognito-identity-js');
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

const authenticateUser = (user, authDetails) => {
  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: (result) => resolve(result),
      onFailure: (err) => reject(err)
    });
  });
};

exports.handler = async (event) => {
  try {
    const { email, password } = event;
    if (!email || !password) {
      return {
        statusCode: 400,
        success: false,
        error: "Missing required fields"
      };
    }

    const user = new CognitoUser({
      Username: email,
      Pool: getCognitoPool()
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    try {
      await authenticateUser(user, authDetails);
      const [data] = await getDataFromDynamoDB(email);
      return {
        statusCode: 200,
        success: true,
        data
      };
    } catch (authError) {
      console.log(authError);
      return {
        statusCode: 500,
        success: false,
        message: "Invalid Credentials",
        error: authError
      };
    }
  }
  catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      success: false,
      message: "Could not authenticate user",
      error
    };
  }
};
  