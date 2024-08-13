const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')
const { v4: uuidv4 } = require('uuid')

const dynamoDb = new DynamoDBClient({})

exports.handler = async event => {
  const body = JSON.parse(event.body)
  const id = uuidv4()
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: { S: id },
      data: { S: body.data },
    },
  }

  try {
    await dynamoDb.send(new PutItemCommand(params))

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
