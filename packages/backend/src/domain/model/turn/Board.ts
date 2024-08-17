import { DomainError } from '../../error/DomainError';
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
      throw new DomainError(
        'SelectedPointIsNotEmpty',
        `Selected point is not empty`,
      );
    }

    // ひっくり返せる点をリストアップ
    const flipPoints = this.listFlipPoints(move);
    if (flipPoints.length === 0) {
      throw new DomainError('FlipPointIsEmpty', `Flip points is empty`);
    }

    // 盤面をコピー
    const newDiscs = this._discs.map((line) => {
      return line.map((disc) => disc);
    });
    // 石を置く
    newDiscs[move.point.y][move.point.x] = move.disc;

    // ひっくり返す
    flipPoints.forEach((p) => {
      newDiscs[p.y][p.x] = move.disc;
    });

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

    const checkFlipPoints = (xMove: number, yMove: number) => {
      let cursorX = walledX + xMove;
      let cursorY = walledY + yMove;
      let flipCandidate: Point[] = [];
      while (isOppositeDisc(move.disc, this._walledDiscs[cursorY][cursorX])) {
        flipCandidate.push(new Point(cursorX - 1, cursorY - 1));
        cursorX += xMove;
        cursorY += yMove;
        if (move.disc === this._walledDiscs[cursorY][cursorX]) {
          flipPoints.push(...flipCandidate);
          break;
        }
      }
    };

    // 上
    checkFlipPoints(0, -1);
    // 左上
    checkFlipPoints(-1, -1);
    // 左
    checkFlipPoints(-1, 0);
    // 左下
    checkFlipPoints(-1, 1);
    // 下
    checkFlipPoints(0, 1);
    // 右下
    checkFlipPoints(1, 1);
    // 右
    checkFlipPoints(1, 0);
    // 右上
    checkFlipPoints(1, -1);

    return flipPoints;
  }

  /**
   * 石を置ける場所があるか
   * @param disc
   * @returns
   */
  existsValidMove(disc: Disc): boolean {
    for (let y = 0; y < this._discs.length; y++) {
      const line = this._discs[y];
      for (let x = 0; x < line.length; x++) {
        const discOnBoard = line[x];
        if (discOnBoard !== Disc.Empty) {
          continue;
        }
        // ひっくり返せる場所があれば石がおける
        const move = new Move(disc, new Point(x, y));
        if (this.listFlipPoints(move).length > 0) {
          return true;
        }
      }
    }
    return false;
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
