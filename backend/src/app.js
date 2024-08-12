const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient()

exports.handler = async event => {
  // リクエストから `id` パラメータを取得
  const id = event.pathParameters.id

  // DynamoDB からデータを取得するためのパラメータを設定
  const params = {
    TableName: process.env.TABLE_NAME, // 環境変数からテーブル名を取得
    Key: {
      id: id,
    },
  }

  try {
    // DynamoDB からデータを取得
    const data = await dynamoDb.get(params).promise()

    // データが存在しない場合の処理
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Item not found' }),
      }
    }

    // 成功レスポンスを返す
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    }
  } catch (error) {
    // エラーレスポンスを返す
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Could not retrieve item',
        error: error.message,
      }),
    }
  }
}
