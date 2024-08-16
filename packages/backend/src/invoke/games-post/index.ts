import {
  AttributeValue,
  DynamoDBClient,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { APIGatewayProxyResult } from 'aws-lambda';
import dayjs from 'dayjs';
import uuid from 'ui7';
import { ALLOW_CORS } from '../HandlerUtil';

const EMPTY = '0';
const DARK = '1';
const LIGHT = '2';

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
export const handler = async (): Promise<APIGatewayProxyResult> => {
  const game_id = uuid() as string;
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
          Item: {
            id: { S: game_id },
            create_at: { S: now },
          } as Record<string, AttributeValue>,
        },
      },
      {
        Put: {
          TableName: process.env.TABLE_NAME_TURNS,
          Item: {
            id: { S: turn_id },
            game_id: { S: game_id },
            turn_count: { N: '0' },
            next_disc: { N: DARK },
            end_at: { S: now },
          } as Record<string, AttributeValue>,
        },
      },
      {
        Put: {
          TableName: process.env.TABLE_NAME_SQUARE,
          Item: {
            id: { S: square_id },
            turn_id: { S: turn_id },
            square: genAttr(),
          } as Record<string, AttributeValue>,
        },
      },
    ],
  };
  const dynamoDb = new DynamoDBClient();
  try {
    const result = await dynamoDb.send(new TransactWriteItemsCommand(params));
    console.info(`Transaction successful: ${result}`);

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

const genAttr = (): AttributeValue => {
  return {
    L: [...squareList],
  };
};

const genSqr = (x: string, y: string, disc: string): AttributeValue => {
  const attr = {
    M: {
      x: { N: x },
      y: { N: y },
      disc: { N: disc },
    },
  };
  return attr;
};

const squareList: AttributeValue[] = [];
INITIAL_BOARD.forEach((line, y) => {
  line.forEach((disc, x) => {
    squareList.push(genSqr(x.toString(), y.toString(), disc));
  });
});
