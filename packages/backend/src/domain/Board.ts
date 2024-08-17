import { Disc } from './Disc';
import { Move } from './Move';

export class Board {
  constructor(private _discs: Disc[][]) {}

  place(move: Move): Board {
    // TODO 盤面におけるかチェック

    // 盤面をコピー
    const newDiscs = this._discs.map((line) => {
      return line.map((disc) => disc);
    });
    // 石を置く
    newDiscs[move.point.y][move.point.x] = move.disc;

    // TODO ひっくり返す

    return new Board(newDiscs);
  }

  get discs(): Disc[][] {
    return this._discs;
  }
}
