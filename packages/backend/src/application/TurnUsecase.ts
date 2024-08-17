import { toDisc } from '../domain/model/turn/Disc';
import { Point } from '../domain/model/turn/Point';
import { TurnRepository } from '../domain/model/turn/TurnRepository';

interface FindTurnOutput {
  turnCount: number;
  board: string[][];
  nextDisc?: string;
  winnerDisc?: string;
}
/**
 * ターンユースケース
 */
export class TurnUsecase {
  /**
   * ターンを取得する
   * @param game_id ゲームID
   * @param turn_count ターン
   */
  async findTurn(game_id: string, turn_count: number): Promise<FindTurnOutput> {
    // リポジトリから取得
    const turn = await new TurnRepository().findTurn(game_id, turn_count);
    const res: FindTurnOutput = {
      turnCount: Number(turn_count),
      board: turn.board.discs,
      nextDisc: turn.nextDisc,
      winnerDisc: undefined,
    };
    return res;
  }

  /**
   * ターンを登録する
   * @param game_id
   * @param turnCount
   * @param x
   * @param y
   * @param disc
   */
  async registerTurn(
    game_id: string,
    turnCount: number,
    x: number,
    y: number,
    disc: string,
  ): Promise<void> {
    // 1つ前のターンリポジトリから取得する
    const previousTurnCount = turnCount - 1;
    const previousTurn = await new TurnRepository().findTurn(
      game_id,
      previousTurnCount,
    );

    // 石を置く
    const newTurn = previousTurn.placeNext(toDisc(disc), new Point(x, y));

    // ターンを保存する
    await new TurnRepository().save(newTurn);
  }
}
