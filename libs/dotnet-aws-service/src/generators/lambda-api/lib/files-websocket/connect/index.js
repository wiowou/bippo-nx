const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = async function (event, context) {
  try {
    await ddb
      .put({
        TableName: process.env.ddb_table_name,
        Item: {
          connectionId: event.requestContext.connectionId,
        },
      })
      .promise();
  } catch (err) {
    return {
      statusCode: 500,
    };
  }
  return {
    statusCode: 200,
  };
};
