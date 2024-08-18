import { Turn } from './Turn';

/**
 * Turn リポジトリ
 */
export interface TurnRepository {
  /**
   * Turn 取得
   * @param game_id
   * @param turn_count
   * @returns
   */
  findTurn(game_id: string, turn_count: number): Promise<Turn>;

  /**
   * Turn を保存
   * @param turn
   */
  save(turn: Turn): Promise<void>;
}
