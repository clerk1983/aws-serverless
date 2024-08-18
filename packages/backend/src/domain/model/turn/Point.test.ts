import { DomainError } from '../../error/DomainError';
import { Point } from './Point';

describe('Point', () => {
  test('should correctly set the x and y properties', () => {
    const point = new Point(3, 4);

    expect(point.x).toBe(3);
    expect(point.y).toBe(4);
  });

  test('should throw an error if x is less than the minimum point', () => {
    expect(() => new Point(-1, 4)).toThrow(DomainError);
    expect(() => new Point(-1, 4)).toThrow('Invalid point');
  });

  test('should throw an error if x is greater than the maximum point', () => {
    expect(() => new Point(8, 4)).toThrow(DomainError);
    expect(() => new Point(8, 4)).toThrow('Invalid point');
  });

  test('should throw an error if y is less than the minimum point', () => {
    expect(() => new Point(3, -1)).toThrow(DomainError);
    expect(() => new Point(3, -1)).toThrow('Invalid point');
  });

  test('should throw an error if y is greater than the maximum point', () => {
    expect(() => new Point(3, 8)).toThrow(DomainError);
    expect(() => new Point(3, 8)).toThrow('Invalid point');
  });

  test('should not throw an error for valid points on the boundary', () => {
    expect(() => new Point(0, 0)).not.toThrow();
    expect(() => new Point(7, 7)).not.toThrow();
  });
});
