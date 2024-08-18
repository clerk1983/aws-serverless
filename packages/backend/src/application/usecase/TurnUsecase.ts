import { GameResult } from '../../domain/model/game-result/GameResult';
import { Disc } from '../../domain/model/turn/Disc';
import { Point } from '../../domain/model/turn/Point';
import { GameResultDynamoDBRepository } from '../../infrastructure/repository/game-result/GameResultDynamoDBRepository';
import { GameDynamoDBRepository } from '../../infrastructure/repository/game/GameDynamoDBRepository';
import { TurnDynamoDBRepository } from '../../infrastructure/repository/turn/TurnDynamoDBRepository';

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
  private gameRepository = new GameDynamoDBRepository();
  private turnRepository = new TurnDynamoDBRepository();
  private gameResultRepository = new GameResultDynamoDBRepository();

  /**
   * ターンを取得する
   * @param game_id ゲームID
   * @param turn_count ターン
   */
  async findTurn(game_id: string, turn_count: number): Promise<FindTurnOutput> {
    // リポジトリから取得
    const turn = await this.turnRepository.findTurn(game_id, turn_count);
    let gameResult: GameResult | undefined;
    gameResult = await this.gameResultRepository.find(game_id);
    const res: FindTurnOutput = {
      turnCount: Number(turn_count),
      board: turn.board.discs,
      nextDisc: turn.nextDisc,
      winnerDisc: gameResult?.winnerDisc,
    };
    return res;
  }

  /**
   * ターンを登録する
   * @param game_id
   * @param turnCount
   * @param point
   * @param disc
   */
  async registerTurn(
    game_id: string,
    turnCount: number,
    point: Point,
    disc: Disc,
  ): Promise<void> {
    // 1つ前のターンリポジトリから取得する
    const previousTurnCount = turnCount - 1;
    const previousTurn = await this.turnRepository.findTurn(
      game_id,
      previousTurnCount,
    );

    // 石を置く
    const newTurn = previousTurn.placeNext(disc, point);

    // ターンを保存する
    await this.turnRepository.save(newTurn);

    // 勝敗が決した場合、勝敗を保存
    if (newTurn.gameEnded()) {
      const winnerDisc = newTurn.winnerDisc();
      console.info(`winnerDisc: ${winnerDisc}`);
      const gameResult = new GameResult(game_id, winnerDisc, newTurn.endAt);
      await this.gameResultRepository.save(gameResult);
    }
  }
}
