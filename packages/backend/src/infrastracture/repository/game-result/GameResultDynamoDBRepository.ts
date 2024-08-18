import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { GameResult } from '../../../domain/model/game-result/GameResult';

interface GamesTableItem {
  winner_disc?: string;
  end_at?: string;
}
interface GamesTableUpdateItem {
  ':winner_disc': string;
  ':end_at': string;
}
interface GamesTableKey {
  game_id: string;
}

/**
 * GameResult リポジトリ
 */
export class GameResultDynamoDBRepository {
  private dynamoDb = new DynamoDBClient({ region: 'ap-northeast-1' });

  /**
   * 勝敗結果を取得
   * @param gameId
   * @returns
   */
  async find(gameId: string): Promise<GameResult | undefined> {
    const gameKey: GamesTableKey = {
      game_id: gameId,
    };
    const game = await this.dynamoDb.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME_GAMES,
        Key: marshall(gameKey),
      }),
    );
    console.info(`game=${JSON.stringify(game)}`);
    if (game.Item) {
      const item = unmarshall(game.Item) as GamesTableItem;
      if (item.winner_disc != null) {
        return new GameResult(gameId, item.winner_disc, item.end_at ?? '');
      }
    }
    return undefined;
  }

  /**
   * GameResult を保存
   * @param game
   */
  async save(gameResult: GameResult): Promise<void> {
    const gameKey: GamesTableKey = {
      game_id: gameResult.gameId,
    };
    const gameItem: GamesTableUpdateItem = {
      ':winner_disc': gameResult.winnerDisc,
      ':end_at': gameResult.endAt,
    };
    console.info(
      `gameKey=${JSON.stringify(gameKey, null, 2)}, gameItem=${JSON.stringify(gameItem)}`,
    );
    // 勝者を更新
    const params = {
      TableName: process.env.TABLE_NAME_GAMES,
      Key: marshall(gameKey),
      UpdateExpression: 'SET winner_disc = :winner_disc, end_at = :end_at',
      ExpressionAttributeValues: marshall(gameItem),
      ReturnValue: 'ALL_NEW',
    };
    const result = await this.dynamoDb.send(new UpdateItemCommand(params));
    console.info(`result=${JSON.stringify(result, null, 2)}`);
  }
}
