import { Disc } from './Disc';
import { Move } from './Move';
import { Point } from './Point';

describe('Move', () => {
  test('should correctly set the disc and point properties', () => {
    const disc = Disc.Dark;
    const point = new Point(3, 4);
    const move = new Move(disc, point);

    expect(move.disc).toBe(disc);
    expect(move.point).toBe(point);
  });

  test('should return the correct point', () => {
    const disc = Disc.Light;
    const point = new Point(1, 2);
    const move = new Move(disc, point);

    expect(move.point.x).toBe(1);
    expect(move.point.y).toBe(2);
  });

  test('should return the correct disc', () => {
    const disc = Disc.Dark;
    const point = new Point(0, 0);
    const move = new Move(disc, point);

    expect(move.disc).toBe(Disc.Dark);
  });
});
