import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event, context) => {
  const command = new PutCommand({
    TableName: process.env.ddb_table_name,
    Item: {
      ConnectionId: event.requestContext.connectionId,
    },
  });
  const response = await docClient.send(command);
  return {
    statusCode: 200,
  };
};
