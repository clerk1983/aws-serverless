import { Game } from './Game';

/**
 * Game リポジトリ
 */
export interface GameRepository {
  /**
   * Game を保存
   * @param game
   */
  save(game: Game): Promise<void>;
}
