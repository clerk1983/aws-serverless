// import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ALLOW_CORS } from '../HandlerUtil';

// const dynamoDb = new DynamoDBClient({});

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const turnCount = event.pathParameters?.turnCount;
  if (!turnCount) {
    return {
      statusCode: 400,
      headers: ALLOW_CORS,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  }
  try {
    return {
      statusCode: 200,
      headers: ALLOW_CORS,
      // body: JSON.stringify(data.Item),
      body: '',
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: ALLOW_CORS,
      body: JSON.stringify({
        message: 'Could not retrieve item',
        error: (error as Error).message,
      }),
    };
  }
};
