import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Game } from '../../../domain/model/game/Game';
import { GameRepository } from '../../../domain/model/game/GameRepository';

interface GamesTableItem {
  game_id: string;
  create_at: string;
}

/**
 * Game リポジトリ
 */
export class GameDynamoDBRepository implements GameRepository {
  private dynamoDb = new DynamoDBClient({ region: 'ap-northeast-1' });

  /**
   * Game を保存
   * @param game
   */
  async save(game: Game): Promise<void> {
    const gameItem: GamesTableItem = {
      game_id: game.gameId,
      create_at: game.createAt,
    };
    console.info(`gameItem=${JSON.stringify(gameItem, null, 2)}`);
    // ゲームを保存する
    const params = {
      TableName: process.env.TABLE_NAME_GAMES,
      Item: marshall(gameItem),
    };
    const result = await this.dynamoDb.send(new PutItemCommand(params));
    console.info(`result=${JSON.stringify(result, null, 2)}`);
  }
}
