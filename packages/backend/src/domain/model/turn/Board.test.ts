import { DomainError } from '../../error/DomainError';
import { Board, INITIAL_BOARD } from './Board';
import { Disc } from './Disc';
import { Move } from './Move';
import { Point } from './Point';

describe('Board', () => {
  it('should initialize with the correct initial discs', () => {
    const board = INITIAL_BOARD;
    expect(board.discs[3][3]).toBe(Disc.Dark);
    expect(board.discs[3][4]).toBe(Disc.Light);
    expect(board.discs[4][3]).toBe(Disc.Light);
    expect(board.discs[4][4]).toBe(Disc.Dark);
  });

  test('should place a disc and flip the opponent discs correctly', () => {
    const discs = [
      [
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
      ],
      [
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
      ],
      [
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
      ],
      [
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Dark,
        Disc.Light,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
      ],
      [
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Light,
        Disc.Dark,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
      ],
      [
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
      ],
      [
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
      ],
      [
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
        Disc.Empty,
      ],
    ];
    const board = new Board(discs);
    const move = new Move(Disc.Dark, new Point(2, 4));
    board.place(move);
  });

  it('should throw an error if placing a disc on a non-empty point', () => {
    const board = INITIAL_BOARD;
    const move = new Move(Disc.Dark, new Point(3, 3));

    expect(() => board.place(move)).toThrow(DomainError);
  });

  it('should throw an error if no discs can be flipped', () => {
    const board = INITIAL_BOARD;
    const move = new Move(Disc.Dark, new Point(0, 0));

    expect(() => board.place(move)).toThrow(DomainError);
  });

  it('should correctly count the number of discs for each player', () => {
    const board = INITIAL_BOARD;
    expect(board.count(Disc.Dark)).toBe(2);
    expect(board.count(Disc.Light)).toBe(2);
    expect(board.count(Disc.Empty)).toBe(60);
  });

  it('should correctly detect if a valid move exists', () => {
    const board = INITIAL_BOARD;
    expect(board.existsValidMove(Disc.Dark)).toBe(true);
    expect(board.existsValidMove(Disc.Light)).toBe(true);
  });
});
