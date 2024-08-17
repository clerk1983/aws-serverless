import { Disc } from './Disc';
import { Point } from './Point';

export class Move {
  constructor(
    private _disc: Disc,
    private _point: Point,
  ) {}

  get point(): Point {
    return this._point;
  }

  get disc(): Disc {
    return this._disc;
  }
}
