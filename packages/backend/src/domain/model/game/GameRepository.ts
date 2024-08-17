import {
  DynamoDBClient,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Game } from './Game';

interface GamesTableItem {
  game_id: string;
  create_at: string;
}

/**
 * Game リポジトリ
 */
export class GameRepository {
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
    console.info(`gameItem=${JSON.stringify(gameItem)}`);
    // ゲームを保存する
    const params = {
      TransactItems: [
        {
          Put: {
            TableName: process.env.TABLE_NAME_GAMES,
            Item: marshall(gameItem),
          },
        },
      ],
    };
    await this.dynamoDb.send(new TransactWriteItemsCommand(params));
  }
}
