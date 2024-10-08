import { DomainError } from '../../error/DomainError';

const MIN_POINT = 0;
const MAX_POINT = 7;

export class Point {
  constructor(
    private _x: number,
    private _y: number,
  ) {
    if (_x < MIN_POINT || _x > MAX_POINT || _y < MIN_POINT || _y > MAX_POINT)
      throw new DomainError('InvalidPoint', 'Invalid point');
  }
  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }
}
