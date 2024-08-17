// import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ALLOW_CORS } from '../HandlerUtil';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const game_id = event.pathParameters?.gameId;
  const turn_count = parseInt(event.pathParameters?.turnCount ?? '');
  console.info(`game_id=${game_id}, turn_count=${turn_count}`);
  if (!game_id || isNaN(turn_count)) {
    return {
      statusCode: 400,
      headers: ALLOW_CORS,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  }
  const dynamoDb = new DynamoDBClient({ region: 'ap-northeast-1' });
  try {
    const turns = await dynamoDb.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME_TURNS,
        Key: marshall({ game_id, turn_count }),
        ConsistentRead: true,
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
        ConsistentRead: true,
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

    const resBody = {
      turnCount: Number(turn_count),
      board,
      nextDisc: turnItem.next_disc,
      winnerDisc: null,
    };
    return {
      statusCode: 200,
      headers: ALLOW_CORS,
      body: JSON.stringify(resBody),
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
