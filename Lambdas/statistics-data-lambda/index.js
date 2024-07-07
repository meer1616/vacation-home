const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const getUserDataFromDynamoDB = async () => {
    try {
        const params = {
            TableName: 'Users',
            ProjectionExpression: 'userId, email, isAdmin'
        };
        
        const data = await dynamoDB.scan(params).promise();
        return data.Items;
    }
    catch(error) {
        console.log(error)
        return error;
    }
}

const generateResponse = async (users) => {
    const userData = await users.map(e => ({ ...e, role: e.isAdmin ? "Property Agent" : "User", lastLoginAt: new Date().toISOString() }))
    const userRoleData = await userData.filter(e => e.role.toLowerCase() == "user")
    // const newUsersData = users.filter((item) => {
    //     return item.date.getTime() <= new Date().getTime() &&
    //             item.date.getTime() >= new Date(new Date().setDate(new Date().getDate() - 1)).getTime();
    // })
    const response = {
        newUsers: 2,
        numberOfUsers: userRoleData.length,
        numberOfPropertyAgents: userData.length - userRoleData.length,
        totalUsers: userData.length,
        totalRooms: 30,
        users: userData,
        concernesAnswered: 10,
        roomBookings: [{
          date: new Date().toDateString(),
          data: 5
        },{
          date: new Date(new Date().setDate(new Date().getDate() - 1)).toDateString(),
          data: 4
        },{
          date: new Date(new Date().setDate(new Date().getDate() - 2)).toDateString(),
          data: 6
        },{
          date: new Date(new Date().setDate(new Date().getDate() - 3)).toDateString(),
          data: 7
        },{
          date: new Date(new Date().setDate(new Date().getDate() - 4)).toDateString(),
          data: 4
        }]
    };
    return response
}

exports.handler = async (event) => {
    try {
        const users = await getUserDataFromDynamoDB();
        return await generateResponse(users)
    } catch(error) {
        return {}
    }
}