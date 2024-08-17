import {
  DynamoDBClient,
  TransactWriteItemsCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import dayjs from 'dayjs';
import { GamesTableItem } from '../dataaccrss';
import { initialTurn } from '../domain/turn/Turn';
import { TurnRepository } from '../domain/turn/TurnRepository';

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
    const gameItem: GamesTableItem = {
      game_id,
      create_at: now,
    };

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
    const dynamoDb = new DynamoDBClient({ region: 'ap-northeast-1' });
    try {
      await dynamoDb.send(new TransactWriteItemsCommand(params));
      // 初期ターン情報を保存
      const firstTurn = initialTurn(game_id, now);
      await new TurnRepository().save(firstTurn);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
