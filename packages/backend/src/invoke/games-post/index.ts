import {
  DynamoDBClient,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import dayjs from 'dayjs';
import uuid from 'ui7';
import { ALLOW_CORS, DARK, EMPTY, LIGHT } from '../HandlerUtil';

const INITIAL_BOARD: string[][] = [
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, DARK, LIGHT, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, LIGHT, DARK, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
];

/**
 * POST /tasks
 * ゲーム開始
 * @param event
 * @returns
 */
export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const game_id = event.pathParameters?.gameId;
  if (!game_id) {
    return {
      statusCode: 400,
      headers: ALLOW_CORS,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  }
  const now = dayjs().toISOString();
  console.info(`game_id=${game_id}, now=${now}`);
  const turn_id = uuid() as string;
  console.info(`turn_id=${turn_id}`);
  // 番の升目の合計
  const squareCount = INITIAL_BOARD.map((line) => line.length).reduce(
    (acc, cur) => acc + cur,
    0,
  );
  console.info(squareCount);

  const square_id = uuid() as string;
  console.info(`square_id=${square_id}`);
  const params = {
    TransactItems: [
      {
        Put: {
          TableName: process.env.TABLE_NAME_GAMES,
          Item: marshall({ game_id, create_at: now }),
        },
      },
      {
        Put: {
          TableName: process.env.TABLE_NAME_TURNS,
          Item: marshall({
            game_id,
            turn_count: 0,
            turn_id,
            next_disc: DARK,
            end_at: now,
          }),
        },
      },
      {
        Put: {
          TableName: process.env.TABLE_NAME_SQUARE,
          Item: marshall({ turn_id, square: genAttr() }),
        },
      },
    ],
  };
  const dynamoDb = new DynamoDBClient({ region: 'ap-northeast-1' });
  try {
    const result = await dynamoDb.send(new TransactWriteItemsCommand(params));
    console.info(`Transaction successful: ${JSON.stringify(result)}`);

    return {
      statusCode: 201,
      headers: ALLOW_CORS,
      body: 'Created',
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: ALLOW_CORS,
      body: JSON.stringify({
        message: 'System error',
        error: (error as Error).message,
      }),
    };
  }
};

const genAttr = (): { x: string; y: string; disc: string }[] => {
  const squareList: { x: string; y: string; disc: string }[] = [];
  INITIAL_BOARD.forEach((line, y) => {
    line.forEach((disc, x) => {
      const item = {
        x: x.toString(),
        y: y.toString(),
        disc,
      };
      squareList.push(item);
    });
  });
  return squareList;
};
