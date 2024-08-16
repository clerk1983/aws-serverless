// import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
// import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
// import { unmarshall } from '@aws-sdk/util-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ALLOW_CORS } from '../HandlerUtil';

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.info(`event=${JSON.stringify(event)}`);
  // const turnCount = event.pathParameters?.turnCount;
  // console.info(`turnCount=${turnCount}`);
  // if (!turnCount) {
  //   return {
  //     statusCode: 400,
  //     headers: ALLOW_CORS,
  //     body: JSON.stringify({ message: 'Invalid request' }),
  //   };
  // }
  // const dynamoDb = new DynamoDBClient({ region: 'ap-northeast-1' });
  // try {
  //   // 最新のゲームIDを取得
  //   const attr = await dynamoDb.send(
  //     new GetItemCommand({
  //       TableName: process.env.TABLE_NAME_ATTRIBUTES,
  //       Key: {
  //         key: { S: KEY_LATEST_GAME_ID },
  //       },
  //     }),
  //   );
  //   const game_id = attr.Item?.value.S ?? '';
  //   console.info(`game_id=${game_id}`);

  //   const turns = await dynamoDb.send(
  //     new GetItemCommand({
  //       TableName: process.env.TABLE_NAME_TURNS,
  //       Key: {
  //         game_id: { S: game_id },
  //         turn_count: { N: turnCount },
  //       },
  //     }),
  //   );
  //   console.info(`turns=${JSON.stringify(turns)}`);

  //   const turnItem = turns.Item ? unmarshall(turns.Item) : undefined;
  //   if (!turnItem) {
  //     return {
  //       statusCode: 400,
  //       headers: ALLOW_CORS,
  //       body: JSON.stringify({ message: 'Invalid request' }),
  //     };
  //   }

  //   const square = await dynamoDb.send(
  //     new GetItemCommand({
  //       TableName: process.env.TABLE_NAME_SQUARE,
  //       Key: {
  //         turn_id: { S: turnItem.turn_id },
  //       },
  //     }),
  //   );
  //   console.info(`square=${JSON.stringify(square)}`);
  //   const squareItem = square.Item ? unmarshall(square.Item) : undefined;
  //   if (!squareItem) {
  //     throw new Error('Could not retrieve item');
  //   }
  //   const squareList = squareItem.square;
  //   console.info(`squareList=${JSON.stringify(squareList)}`);

  //   const board = Array.from(Array(8)).map(() => Array.from(Array(8)));
  //   console.info(`board=${JSON.stringify(board)}`);
  //   squareList.forEach((item: { x: string; y: string; disc: string }) => {
  //     console.info(`item=${JSON.stringify(item)}`);
  //     board[Number(item.y)][Number(item.x)] = item.disc;
  //   });
  //   console.info(`board=${JSON.stringify(board)}`);

  //   const resBody = {
  //     turnCount: Number(turnCount),
  //     board,
  //     nextDisc: turnItem.next_disc,
  //     winnerDisc: null,
  //   };
  return {
    statusCode: 200,
    headers: ALLOW_CORS,
    body: '',
  };
  // } catch (error) {
  //   return {
  //     statusCode: 500,
  //     headers: ALLOW_CORS,
  //     body: JSON.stringify({
  //       message: 'Could not retrieve item',
  //       error: (error as Error).message,
  //     }),
  //   };
  // }
};
