import {
  DynamoDBClient,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import dayjs from 'dayjs';
import uuid from 'ui7';
import { GamesTableItem, SquareTableItem, TurnsTableItem } from '../dataaccrss';
import { DARK, EMPTY, LIGHT } from '../invoke/HandlerUtil';

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
 * ゲームユースケース
 */
export class GameUsecase {
  /**
   * 新規ゲーム開始
   * @param game_id ゲームID
   */
  async startNewGame(game_id: string): Promise<void> {
    console.log('start new game');
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

    const gameItem: GamesTableItem = {
      game_id,
      create_at: now,
    };
    const turnItem: TurnsTableItem = {
      game_id,
      turn_count: 0,
      turn_id,
      next_disc: DARK,
      end_at: now,
    };
    const squareItem: SquareTableItem = {
      turn_id,
      square: this.genAttr(),
    };
    const params = {
      TransactItems: [
        {
          Put: {
            TableName: process.env.TABLE_NAME_GAMES,
            Item: marshall(gameItem),
          },
        },
        {
          Put: {
            TableName: process.env.TABLE_NAME_TURNS,
            Item: marshall(turnItem),
          },
        },
        {
          Put: {
            TableName: process.env.TABLE_NAME_SQUARE,
            Item: marshall(squareItem),
          },
        },
      ],
    };
    const dynamoDb = new DynamoDBClient({ region: 'ap-northeast-1' });
    try {
      const result = await dynamoDb.send(new TransactWriteItemsCommand(params));
      console.info(`Transaction successful: ${JSON.stringify(result)}`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  private genAttr(): { x: string; y: string; disc: string }[] {
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
  }
}
