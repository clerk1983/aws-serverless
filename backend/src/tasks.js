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

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  // HTTPメソッドによる条件分岐
  if (event.httpMethod === 'GET') {
    // GETリクエストの場合の処理
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        id: { S: id },
      },
    }
    try {
      const data = await dynamoDb.send(new GetItemCommand(params))
      response = {
        statusCode: 200,
        headers,
        body: JSON.stringify(data.Item),
      }
    } catch (error) {
      console.error(error)
      response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Could not retrieve item',
          error: error.message,
        }),
      }
    }
  } else if (event.httpMethod === 'POST') {
    // POSTリクエストの場合の処理
    const body = JSON.parse(event.body)
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: { S: id },
        data: { S: body.data },
      },
    }
    try {
      await dynamoDb.send(new PutItemCommand(params))
      response = {
        headers,
        statusCode: 200,
        body: JSON.stringify({ message: 'Item created/updated successfully' }),
      }
    } catch (error) {
      console.error(error)
      response = {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Could not create/update item',
          error: error.message,
        }),
      }
    }
  } else {
    // その他のHTTPメソッドの場合の処理
    response = {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    }
  }

  return response
}
