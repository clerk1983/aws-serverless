import { Disc, isOppositeDisc } from './Disc';
import { Move } from './Move';
import { Point } from './Point';

export class Board {
  private _walledDiscs: Disc[][];
  constructor(private _discs: Disc[][]) {
    this._walledDiscs = this.wallDiscs();
  }

  place(move: Move): Board {
    // 盤面におけるかチェック
    // 空のマス目であること
    if (this._discs[move.point.y][move.point.x] !== Disc.Empty) {
      throw new Error(`Selected point is not empty`);
    }

    // ひっくり返せる点をリストアップ
    const flipPoints = this.listFlipPoints(move);
    if (flipPoints.length === 0) {
      throw new Error(`Flip points is empty`);
    }
    // ひっくり返せる点以外はエラー

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

  /**
   * 壁（番兵）に囲まれたボードを生成
   * @returns
   */
  private wallDiscs(): Disc[][] {
    const walled: Disc[][] = [];
    const topAndBottomWall = Array(this._discs[0].length + 2).fill(Disc.Wall);
    walled.push(topAndBottomWall);
    this._discs.forEach((line) => {
      const walledLine = [Disc.Wall, ...line, Disc.Wall];
      walled.push(walledLine);
    });
    walled.push(topAndBottomWall);
    return walled;
  }

  /**
   * ひっくり返せる点をリストアップ
   * @returns
   */
  private listFlipPoints(move: Move): Point[] {
    const flipPoints: Point[] = [];

    const walledX = move.point.x + 1;
    const walledY = move.point.y + 1;

    // 上
    const flipCandidate: Point[] = [];
    let cursorX = walledX;
    let cursorY = walledY - 1;
    while (isOppositeDisc(move.disc, this._walledDiscs[cursorY][cursorX])) {
      // 番兵を考慮して - 1
      flipCandidate.push(new Point(cursorX - 1, cursorY - 1));
      cursorY--;
      if (move.disc === this._walledDiscs[cursorY][cursorX]) {
        flipPoints.push(...flipCandidate);
        break;
      }
    }

    return flipPoints;
  }
}

const E = Disc.Empty;
const D = Disc.Dark;
const L = Disc.Light;

const INITIAL_DISCS: Disc[][] = [
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, D, L, E, E, E],
  [E, E, E, L, D, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
];

export const INITIAL_BOARD = new Board(INITIAL_DISCS);
