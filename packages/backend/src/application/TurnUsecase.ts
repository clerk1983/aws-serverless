import {
  DynamoDBClient,
  GetItemCommand,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import dayjs from 'dayjs';
import uuid from 'ui7';
import { DARK, LIGHT } from '../invoke/HandlerUtil';

interface FindTurnOutput {
  turnCount: number;
  board: string[][];
  nextDisc?: string;
  winnerDisc?: string;
}
/**
 * ターンユースケース
 */
export class TurnUsecase {
  /**
   * ターンを取得する
   * @param game_id ゲームID
   * @param turn_count ターン
   */
  async findTurn(game_id: string, turn_count: number): Promise<FindTurnOutput> {
    const dynamoDb = new DynamoDBClient({ region: 'ap-northeast-1' });
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
      throw new Error('Could not retrieve item');
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
    const res: FindTurnOutput = {
      turnCount: Number(turn_count),
      board,
      nextDisc: turnItem.next_disc,
      winnerDisc: undefined,
    };
    return res;
  }

  /**
   * ターンを登録する
   * @param game_id
   * @param turnCount
   * @param x
   * @param y
   * @param disc
   */
  async registerTurn(
    game_id: string,
    turnCount: number,
    x: number,
    y: number,
    disc: string,
  ): Promise<void> {
    // 1つ前のターンを取得する
    const previousTurnCount = turnCount - 1;

    const dynamoDb = new DynamoDBClient({ region: 'ap-northeast-1' });
    const turns = await dynamoDb.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME_TURNS,
        Key: marshall({ game_id, turn_count: previousTurnCount }),
      }),
    );
    console.info(`turns=${JSON.stringify(turns)}`);

    const turnItem = turns.Item ? unmarshall(turns.Item) : undefined;
    if (!turnItem) {
      throw new Error('Could not retrieve item');
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
    const board: string[][] = Array.from(Array(8)).map(() =>
      Array.from(Array(8)),
    );
    console.info(`board=${JSON.stringify(board)}`);
    squareList.forEach((item: { x: string; y: string; disc: string }) => {
      console.info(`item=${JSON.stringify(item)}`);
      board[Number(item.y)][Number(item.x)] = item.disc;
    });
    console.info(`board=${JSON.stringify(board)}`);

    // 盤面に置けるかチェック

    // 石を置く
    board[y][x] = disc;

    // ひっくり返す

    // ターンを保存する
    const next_disc = disc == DARK ? LIGHT : DARK;
    const turn_id = uuid() as string;
    const now = dayjs().toISOString();
    const params = {
      TransactItems: [
        {
          Put: {
            TableName: process.env.TABLE_NAME_TURNS,
            Item: marshall({
              game_id,
              turn_count: turnCount,
              turn_id,
              disc,
              x: x.toString(),
              y: y.toString(),
              next_disc,
              end_at: now,
            }),
          },
        },
        {
          Put: {
            TableName: process.env.TABLE_NAME_SQUARE,
            Item: marshall({ turn_id, square: this.genAttr(board) }),
          },
        },
      ],
    };
    const result = await dynamoDb.send(new TransactWriteItemsCommand(params));
    console.info(`Transaction successful: ${JSON.stringify(result)}`);
  }

  private genAttr(board: string[][]): { x: string; y: string; disc: string }[] {
    const squareList: { x: string; y: string; disc: string }[] = [];
    board.forEach((line, y) => {
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
  }
}
