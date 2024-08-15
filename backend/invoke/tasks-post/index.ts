import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'

const dynamoDb = new DynamoDBClient({})

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body || '{}')
  const id = uuidv4()
  const params = {
    TableName: process.env.TABLE_NAME as string,
    Item: {
      id: { S: id },
      data: { S: body.data },
    },
  }
  try {
    await dynamoDb.send(new PutItemCommand(params))
    let aaa
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*', // CORSを許可
      },
      body: JSON.stringify({ id: id, message: 'Item created successfully' }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // CORSを許可
      },
      body: JSON.stringify({
        message: 'Could not create item',
        error: error.message,
      }),
    }
  }
}
