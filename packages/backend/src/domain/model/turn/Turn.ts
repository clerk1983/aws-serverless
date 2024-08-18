import dayjs from 'dayjs';
import uuid from 'ui7';
import { DomainError } from '../../error/DomainError';
import { WinnerDisc } from '../game-result/WinnerDisc';
import { Board, INITIAL_BOARD } from './Board';
import { Disc } from './Disc';
import { Move } from './Move';
import { Point } from './Point';

export class Turn {
  private _turnId = uuid() as string;

  constructor(
    private _gameId: string,
    private _turnCount: number,
    private _nextDisc: Disc | undefined,
    private _move: Move | undefined,
    private _board: Board,
    private _endAt: string,
  ) {}

  placeNext(disc: Disc, point: Point): Turn {
    // 打とうした石が次の石では無い場合は置くことはできない
    if (disc !== this._nextDisc) {
      throw new DomainError('SelectedDiscIsNoNextDisc', 'Invalid disc');
    }

    const move = new Move(disc, point);

    const nextBoard = this._board.place(move);

    const nextDisc = this.decideNextDisc(nextBoard, disc);

    return new Turn(
      this._gameId,
      this._turnCount + 1,
      nextDisc,
      move,
      nextBoard,
      dayjs().toISOString(),
    );
  }

  gameEnded(): boolean {
    return this.nextDisc === undefined;
  }

  winnerDisc(): WinnerDisc {
    const darkCount = this._board.count(Disc.Dark);
    const lightCount = this._board.count(Disc.Light);
    if (darkCount > lightCount) {
      return WinnerDisc.Dark;
    } else if (darkCount < lightCount) {
      return WinnerDisc.Light;
    } else {
      return WinnerDisc.Dark;
    }
  }

  /**
   * 次における石を決定
   * @param board
   * @param previousDisc
   * @returns
   */
  private decideNextDisc(board: Board, previousDisc: Disc): Disc | undefined {
    const existsDarkValidMove = board.existsValidMove(Disc.Dark);
    const existsLightValidMove = board.existsValidMove(Disc.Light);
    if (existsDarkValidMove && existsLightValidMove) {
      return previousDisc === Disc.Dark ? Disc.Light : Disc.Dark;
    } else if (!existsDarkValidMove && !existsLightValidMove) {
      // 決着
      return undefined;
    } else if (existsDarkValidMove) {
      return Disc.Dark;
    } else {
      return Disc.Light;
    }
  }

  get gameId(): string {
    return this._gameId;
  }
  get turnCount(): number {
    return this._turnCount;
  }
  get turnId(): string {
    return this._turnId;
  }
  get nextDisc(): Disc | undefined {
    return this._nextDisc;
  }
  get move(): Move | undefined {
    return this._move;
  }
  get board(): Board {
    return this._board;
  }
  get endAt(): string {
    return this._endAt;
  }
}
export const initialTurn = (
  game_id: string,
  end_at = dayjs().toISOString(),
) => {
  return new Turn(game_id, 0, Disc.Dark, undefined, INITIAL_BOARD, end_at);
};
