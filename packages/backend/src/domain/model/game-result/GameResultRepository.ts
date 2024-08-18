import { GameResult } from './GameResult';

/**
 * GameResult リポジトリ
 */
export interface GameResultRepository {
  /**
   * 勝敗結果を取得
   * @param gameId
   * @returns
   */
  find(gameId: string): Promise<GameResult | undefined>;

  /**
   * GameResult を保存
   * @param game
   */
  save(gameResult: GameResult): Promise<void>;
}
