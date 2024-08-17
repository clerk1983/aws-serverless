import {
  DynamoDBClient,
  GetItemCommand,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
  SquareTableItem,
  SquareTableKey,
  TurnsTableItem,
  TurnsTableKey,
} from '../dataaccrss';
import { Board } from '../domain/Board';
import { Disc, toDisc } from '../domain/Disc';
import { Point } from '../domain/Point';
import { Turn } from '../domain/Turn';

interface FindTurnOutput {
  turnCount: number;
  board: string[][];
  nextDisc?: string;
  winnerDisc?: string;
}
interface Square {
  x: string;
  y: string;
  disc: Disc;
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
    const turnKey: TurnsTableKey = {
      game_id,
      turn_count,
    };
    const turns = await dynamoDb.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME_TURNS,
        Key: marshall(turnKey),
        ConsistentRead: true,
      }),
    );
    console.info(`turns=${JSON.stringify(turns)}`);

    const turnItem = (
      turns.Item ? unmarshall(turns.Item) : undefined
    ) as TurnsTableItem;
    if (!turnItem) {
      throw new Error('Could not retrieve item');
    }

    const squareKey: SquareTableKey = {
      turn_id: turnItem.turn_id,
    };

    const square = await dynamoDb.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME_SQUARE,
        Key: marshall(squareKey),
        ConsistentRead: true,
      }),
    );
    console.info(`square=${JSON.stringify(square)}`);
    const squareItem = (
      square.Item ? unmarshall(square.Item) : undefined
    ) as SquareTableItem;
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
    squareList.forEach((item) => {
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
    const turnKey: TurnsTableKey = {
      game_id,
      turn_count: previousTurnCount,
    };
    const turns = await dynamoDb.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME_TURNS,
        Key: marshall(turnKey),
      }),
    );
    console.info(`turns=${JSON.stringify(turns)}`);

    const turnItem = (
      turns.Item ? unmarshall(turns.Item) : undefined
    ) as TurnsTableItem;
    if (!turnItem) {
      throw new Error('Could not retrieve item');
    }

    const squareKey: SquareTableKey = {
      turn_id: turnItem.turn_id,
    };
    const square = await dynamoDb.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME_SQUARE,
        Key: marshall(squareKey),
      }),
    );
    console.info(`square=${JSON.stringify(square)}`);
    const squareItem = (
      square.Item ? unmarshall(square.Item) : undefined
    ) as SquareTableItem;
    console.info(`squareItem=${JSON.stringify(squareItem)}`);
    if (!squareItem) {
      throw new Error('Could not retrieve item');
    }
    const squareList = squareItem.square;
    console.info(`squareList=${JSON.stringify(squareList)}`);

    // 空の盤面を生成し、ディスク情報を設定
    const board: Disc[][] = Array.from(Array(8)).map(() =>
      Array.from(Array(8)),
    );
    console.info(`board=${JSON.stringify(board)}`);
    squareList.forEach((item: { x: string; y: string; disc: string }) => {
      console.info(`item=${JSON.stringify(item)}`);
      board[Number(item.y)][Number(item.x)] = toDisc(item.disc);
    });
    console.info(`board=${JSON.stringify(board)}`);

    const previousTurn = new Turn(
      game_id,
      previousTurnCount,
      toDisc(turnItem.next_disc),
      undefined,
      new Board(board),
      turnItem.end_at,
    );

    // 盤面に置けるかチェック

    // 石を置く
    const newTurn = previousTurn.placeNext(toDisc(disc), new Point(x, y));

    // ひっくり返す

    const turnsItem: TurnsTableItem = {
      game_id: newTurn.gameId,
      turn_count: newTurn.turnCount,
      turn_id: newTurn.turnId,
      disc: newTurn.move?.disc,
      x: newTurn.move?.point.x.toString(),
      y: newTurn.move?.point.y.toString(),
      next_disc: newTurn.nextDisc,
      end_at: newTurn.endAt,
    };
    const squareInput: SquareTableItem = {
      turn_id: newTurn.turnId,
      square: this.genAttr(board),
    };
    // ターンを保存する
    const params = {
      TransactItems: [
        {
          Put: {
            TableName: process.env.TABLE_NAME_TURNS,
            Item: marshall(turnsItem),
          },
        },
        {
          Put: {
            TableName: process.env.TABLE_NAME_SQUARE,
            Item: marshall(squareInput),
          },
        },
      ],
    };
    const result = await dynamoDb.send(new TransactWriteItemsCommand(params));
    console.info(`Transaction successful: ${JSON.stringify(result)}`);
  }

  private genAttr(board: Disc[][]): Square[] {
    const squareList: Square[] = [];
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
