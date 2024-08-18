import {
  DynamoDBClient,
  GetItemCommand,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { DomainError } from '../../../domain/error/DomainError';
import { Board } from '../../../domain/model/turn/Board';
import { Disc, toDisc } from '../../../domain/model/turn/Disc';
import { Move } from '../../../domain/model/turn/Move';
import { Point } from '../../../domain/model/turn/Point';
import { Turn } from '../../../domain/model/turn/Turn';

interface TurnsTableItem {
  game_id: string;
  turn_count: number;
  turn_id: string;
  disc?: string;
  x?: string;
  y?: string;
  next_disc?: string;
  end_at: string;
}
interface TurnsTableKey {
  game_id: string;
  turn_count: number;
}

interface SquareTableItem {
  turn_id: string;
  square: SquareItem[];
}

interface SquareItem {
  x: string;
  y: string;
  disc: string;
}

interface SquareTableKey {
  turn_id: string;
}

/**
 * Turn リポジトリ
 */
export class TurnDynamoDBRepository {
  private dynamoDb = new DynamoDBClient({ region: 'ap-northeast-1' });

  /**
   * Turn 取得
   * @param game_id
   * @param turn_count
   * @returns
   */
  async findTurn(game_id: string, turn_count: number): Promise<Turn> {
    const turnKey: TurnsTableKey = {
      game_id,
      turn_count,
    };
    const turnItem = await this.getTurnItem(turnKey);

    const turn_id = turnItem.turn_id;
    let move: Move | undefined = undefined;
    if (turnItem.disc != null) {
      const disc = toDisc(turnItem.disc);
      if (turnItem.x != null && turnItem.y != null) {
        const point = new Point(Number(turnItem.x), Number(turnItem.y));
        move = new Move(disc, point);
      }
    }
    const next_disc = turnItem.next_disc
      ? toDisc(turnItem.next_disc)
      : undefined;
    const end_at = turnItem.end_at;

    const squareKey: SquareTableKey = {
      turn_id,
    };
    const squareItem = await this.getSquareItem(squareKey);
    const squareList = squareItem.square;
    console.info(`squareList=${JSON.stringify(squareList)}`);

    // 空の盤面を生成し、ディスク情報を設定
    const _board: Disc[][] = Array.from(Array(8)).map(() =>
      Array.from(Array(8)),
    );
    squareList.forEach((item: SquareItem) => {
      _board[Number(item.y)][Number(item.x)] = toDisc(item.disc);
    });
    console.info(`board=${JSON.stringify(_board)}`);
    const board = new Board(_board);
    const turn = new Turn(game_id, turn_count, next_disc, move, board, end_at);
    return turn;
  }

  private async getTurnItem(key: TurnsTableKey): Promise<TurnsTableItem> {
    const turns = await this.dynamoDb.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME_TURNS,
        Key: marshall(key),
        ConsistentRead: true,
      }),
    );
    console.info(`turns=${JSON.stringify(turns)}`);
    if (!turns.Item) {
      throw new DomainError(
        'SpecifiedTurnNotFound',
        'Specified Turn Not Found',
      );
    }
    const turnItem = unmarshall(turns.Item) as TurnsTableItem;
    return turnItem;
  }

  private async getSquareItem(key: SquareTableKey): Promise<SquareTableItem> {
    const square = await this.dynamoDb.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME_SQUARE,
        Key: marshall(key),
        ConsistentRead: true,
      }),
    );
    console.info(`square=${JSON.stringify(square)}`);
    if (!square.Item) {
      throw new DomainError(
        'SpecifiedTurnNotFound',
        'Could not retrieve item by rvs-squares',
      );
    }
    const squareItem = unmarshall(square.Item) as SquareTableItem;
    return squareItem;
  }

  /**
   * Turn を保存
   * @param turn
   */
  async save(turn: Turn): Promise<void> {
    const turnsItem: TurnsTableItem = {
      game_id: turn.gameId,
      turn_count: turn.turnCount,
      turn_id: turn.turnId,
      disc: turn.move?.disc,
      x: turn.move?.point.x.toString(),
      y: turn.move?.point.y.toString(),
      next_disc: turn.nextDisc,
      end_at: turn.endAt,
    };
    console.info(`turnsItem=${JSON.stringify(turnsItem)}`);
    const squaresItem: SquareTableItem = {
      turn_id: turn.turnId,
      square: this.genAttr(turn.board.discs),
    };
    console.info(`squaresItem=${JSON.stringify(squaresItem)}`);
    // ターンを保存する
    const params = {
      TransactItems: [
        {
          Put: {
            TableName: process.env.TABLE_NAME_TURNS,
            Item: marshall(turnsItem, { removeUndefinedValues: true }),
          },
        },
        {
          Put: {
            TableName: process.env.TABLE_NAME_SQUARE,
            Item: marshall(squaresItem),
          },
        },
      ],
    };
    const result = await this.dynamoDb.send(
      new TransactWriteItemsCommand(params),
    );
    console.info(`Transaction successful: ${JSON.stringify(result)}`);
  }

  private genAttr(discs: Disc[][]): SquareItem[] {
    const squareList: SquareItem[] = [];
    discs.forEach((line, y) => {
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
