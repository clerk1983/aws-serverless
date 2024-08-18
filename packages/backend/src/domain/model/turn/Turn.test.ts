import { DomainError } from '../../error/DomainError';
import { Board } from './Board';
import { Disc } from './Disc';
import { Point } from './Point';
import { initialTurn } from './Turn';

describe('Turn', () => {
  const gameId = 'game-id-123';
  const endAt = '2024-08-18T12:00:00Z';
  const initial = initialTurn(gameId, endAt);

  test('should create an initial turn correctly', () => {
    expect(initial.gameId).toBe(gameId);
    expect(initial.turnCount).toBe(0);
    expect(initial.nextDisc).toBe(Disc.Dark);
    expect(initial.move).toBeUndefined();
    expect(initial.board).toBeInstanceOf(Board);
    expect(initial.endAt).toBe(endAt);
  });

  test('should throw an error if trying to place a disc that is not the next disc', () => {
    const point = new Point(3, 2);
    expect(() => initial.placeNext(Disc.Light, point)).toThrow(DomainError);
  });
});
