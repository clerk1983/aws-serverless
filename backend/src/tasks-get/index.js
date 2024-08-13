const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb')

const dynamoDb = new DynamoDBClient({})

exports.handler = async event => {
  const id = event.pathParameters.id
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: { S: id },
    },
  }

  try {
    const data = await dynamoDb.send(new GetItemCommand(params))

    if (!data.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*', // CORSを許可
        },
        body: JSON.stringify({ message: 'Item not found' }),
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // CORSを許可
      },
      body: JSON.stringify(data.Item),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // CORSを許可
      },
      body: JSON.stringify({
        message: 'Could not retrieve item',
        error: error.message,
      }),
    }
  }
}
