const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getDataFromDynamoDB = async (email, answer) => {
  const params = {
    TableName: 'Users',
    KeyConditionExpression: 'email = :email',
    FilterExpression: 'securityAnswer = :answer',
    ExpressionAttributeValues: {
      ':email': email,
      ':answer': answer
    },
    ProjectionExpression: 'email',
    Limit: 1,
    ScanIndexForward: false
  };
  
  const data = await dynamoDB.query(params).promise();
  return data.Items;
}

exports.handler = async (event) => {
  try {
    const { email, answer } = event;
    if (!email || !answer) {
      return {
        statusCode: 400,
        success: false,
        error: "Missing required fields"
      };
    }

    const [data] = await getDataFromDynamoDB(email, answer);
    if (data.email) {
      return {
        statusCode: 200,
        success: true,
        data
      };
    }
    else {
      return {
        statusCode: 200,
        success: false,
        data: "Invalid answer"
      };
    }

  }
  catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      success: false,
      message: "Answer is not valid",
      error
    };
  }
};
  