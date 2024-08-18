import { Game } from '../../domain/model/game/Game';
import { initialTurn } from '../../domain/model/turn/Turn';
import { GameDynamoDBRepository } from '../../infrastructure/repository/game/GameDynamoDBRepository';
import { TurnDynamoDBRepository } from '../../infrastructure/repository/turn/TurnDynamoDBRepository';

/**
 * ゲームユースケース
 */
export class GameUsecase {
  private gameRepository = new GameDynamoDBRepository();
  private turnRepository = new TurnDynamoDBRepository();

  /**
   * 新規ゲーム開始
   * @param game_id ゲームID
   */
  async startNewGame(game_id: string): Promise<void> {
    console.log('start new game');
    console.info(`game_id=${game_id}`);
    const newGame = new Game(game_id);
    try {
      // ゲーム情報を保存
      await this.gameRepository.save(newGame);
      // 初期ターン情報を保存
      const firstTurn = initialTurn(game_id);
      await this.turnRepository.save(firstTurn);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
