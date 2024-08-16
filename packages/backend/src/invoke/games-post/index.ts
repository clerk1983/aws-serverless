import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
} from '@aws-sdk/client-dynamodb'
import { APIGatewayProxyResult } from 'aws-lambda'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { ALLOW_CORS } from '../HandlerUtil'

const dynamoDb = new DynamoDBClient({})

export const handler = async (): Promise<APIGatewayProxyResult> => {
  const uuid = uuidv4()
  const createAt = dayjs().toISOString()
  console.info(`uuid=${uuid}, createAt=${createAt}`)

  const params: PutItemCommandInput = {
    TableName: process.env.TABLE_NAME_GAMES,
    Item: {
      id: { S: uuid },
      createAt: { S: createAt },
    },
  }

  try {
    await dynamoDb.send(new PutItemCommand(params))
    return {
      statusCode: 201,
      headers: ALLOW_CORS,
      body: 'Created',
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: ALLOW_CORS,
      body: JSON.stringify({
        message: 'System error',
        error: (error as Error).message,
      }),
    }
  }
}
