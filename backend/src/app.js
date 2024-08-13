const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb')

const dynamoDb = new DynamoDBClient({})

exports.handler = async event => {
  console.info(event.pathParameters)
  const id = event.pathParameters.id
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: { S: id },
    },
  }

  try {
    const data = await dynamoDb.send(new GetItemCommand(params))
    const headers = {
      'Access-Control-Allow-Origin': '*', // 必要に応じてオリジンを指定
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
    if (!data.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ message: 'Item not found' }),
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data.Item),
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: 'Could not retrieve item',
        error: error.message,
      }),
    }
  }
}
