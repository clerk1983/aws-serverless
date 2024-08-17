import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

/**
 * ターンユースケース
 */
export class TurnUsecase {
  /**
   * ターンを取得する
   * @param game_id ゲームID
   * @param turn_count ターン
   */
  async findTurn(
    game_id: string,
    turn_count: number,
  ): Promise<{
    turnCount: number;
    board: string[][];
    nextDisc: string;
    winnerDisc: string | undefined;
  }> {
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
    const res = {
      turnCount: Number(turn_count),
      board,
      nextDisc: turnItem.next_disc,
      winnerDisc: undefined,
    };
    return res;
  }
}
