import { Game } from '../domain/game/Game';
import { GameRepository } from '../domain/game/GameRepository';
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
    console.info(`game_id=${game_id}`);
    const newGame = new Game(game_id);
    try {
      // ゲーム情報を保存
      await new GameRepository().save(newGame);
      // 初期ターン情報を保存
      const firstTurn = initialTurn(game_id);
      await new TurnRepository().save(firstTurn);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
