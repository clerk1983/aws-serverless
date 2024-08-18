import { DomainError } from '../../error/DomainError';
import { Disc, isOppositeDisc, toDisc } from './Disc'; // 実際のファイル名に置き換えてください

describe('Disc', () => {
  it('should return a valid Disc type when calling toDisc with valid values', () => {
    expect(toDisc(Disc.Empty)).toBe(Disc.Empty);
    expect(toDisc(Disc.Dark)).toBe(Disc.Dark);
    expect(toDisc(Disc.Light)).toBe(Disc.Light);
    expect(toDisc(Disc.Wall)).toBe(Disc.Wall);
  });

  it('should throw a DomainError when calling toDisc with an invalid value', () => {
    expect(() => toDisc('invalid')).toThrow(DomainError);
  });

  it('should correctly identify opposite discs', () => {
    expect(isOppositeDisc(Disc.Dark, Disc.Light)).toBe(true);
    expect(isOppositeDisc(Disc.Light, Disc.Dark)).toBe(true);
    expect(isOppositeDisc(Disc.Dark, Disc.Dark)).toBe(false);
    expect(isOppositeDisc(Disc.Light, Disc.Light)).toBe(false);
    expect(isOppositeDisc(Disc.Empty, Disc.Dark)).toBe(false);
  });

  it('should return false for non-opposite discs', () => {
    expect(isOppositeDisc(Disc.Empty, Disc.Empty)).toBe(false);
    expect(isOppositeDisc(Disc.Wall, Disc.Dark)).toBe(false);
    expect(isOppositeDisc(Disc.Wall, Disc.Light)).toBe(false);
  });
});
