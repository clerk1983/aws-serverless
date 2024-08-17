import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ALLOW_CORS } from '../HandlerUtil';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.info(`event=${JSON.stringify(event)}`);
  const game_id = event.pathParameters?.gameId;
  console.info(`game_id=${game_id}`);
  if (!game_id || !event.body)
    return {
      statusCode: 400,
      headers: ALLOW_CORS,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  const body = JSON.parse(event.body);
  const turnCount = parseInt(body.turnCount);
  const x = parseInt(body.move.x);
  const y = parseInt(body.move.y);
  const disc = parseInt(body.move.disc);
  console.info(`turnCount=${turnCount}, x=${x}, y=${y}, disc=${disc}`);

  // 1つ前のターンを取得する
  const previousTurnCount = turnCount - 1;

  const dynamoDb = new DynamoDBClient({ region: 'ap-northeast-1' });
  try {
    const turns = await dynamoDb.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME_TURNS,
        Key: marshall({ game_id, turn_count: previousTurnCount }),
      }),
    );
    console.info(`turns=${JSON.stringify(turns)}`);

    const turnItem = turns.Item ? unmarshall(turns.Item) : undefined;
    if (!turnItem) {
      return {
        statusCode: 400,
        headers: ALLOW_CORS,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }

    const square = await dynamoDb.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME_SQUARE,
        Key: marshall({ turn_id: turnItem.turn_id }),
      }),
    );
    console.info(`square=${JSON.stringify(square)}`);
    const squareItem = square.Item ? unmarshall(square.Item) : undefined;
    if (!squareItem) {
      throw new Error('Could not retrieve item');
    }
    const squareList = squareItem.square;
    console.info(`squareList=${JSON.stringify(squareList)}`);

    // 空の盤面を生成し、ディスク情報を設定
    const board = Array.from(Array(8)).map(() => Array.from(Array(8)));
    console.info(`board=${JSON.stringify(board)}`);
    squareList.forEach((item: { x: string; y: string; disc: string }) => {
      console.info(`item=${JSON.stringify(item)}`);
      board[Number(item.y)][Number(item.x)] = item.disc;
    });
    console.info(`board=${JSON.stringify(board)}`);

    // 盤面に置けるかチェック

    // 石を置く

    // ひっくり返す

    // ターンを保存する

    return {
      statusCode: 201,
      headers: ALLOW_CORS,
      body: '',
    };
  } catch (error) {
    console.error(error);
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
