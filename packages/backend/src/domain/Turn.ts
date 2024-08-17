import dayjs from 'dayjs';
import uuid from 'ui7';
import { DARK, LIGHT } from '../invoke/HandlerUtil';
import { Board } from './Board';
import { Disc } from './Disc';
import { Move } from './Move';
import { Point } from './Point';

export class Turn {
  private _turnId = uuid() as string;

  constructor(
    private _gameId: string,
    private _turnCount: number,
    private _nextDisc: Disc,
    private _move: Move | undefined,
    private _board: Board,
    private _endAt: string,
  ) {}

  placeNext(disc: Disc, point: Point): Turn {
    // 打とうした石が次の石では無い場合は置くことはできない
    if (disc !== this._nextDisc) {
      throw new Error('Invalid disc');
    }

    const move = new Move(disc, point);

    const newBoard = this._board.place(move);

    // TODO 次の石が置けないときはスキップ
    const nextDisc = disc === DARK ? LIGHT : DARK;

    return new Turn(
      this._gameId,
      this._turnCount + 1,
      nextDisc,
      move,
      newBoard,
      dayjs().toISOString(),
    );
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
  get nextDisc(): Disc {
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
