import { DomainError } from '../../error/DomainError';

export const Disc = {
  Empty: '0',
  Dark: '1',
  Light: '2',
  Wall: '3',
} as const;

export type Disc = (typeof Disc)[keyof typeof Disc];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toDisc = (disc: any): Disc => {
  if (!Object.values(Disc).includes(disc)) {
    console.error(disc);
    throw new DomainError('InvalidDiscValue', 'Invalid Disc Value');
  }
  return disc as Disc;
};

export const isOppositeDisc = (disc1: Disc, disc2: Disc): boolean => {
  return (
    (disc1 === Disc.Dark && disc2 === Disc.Light) ||
    (disc1 === Disc.Light && disc2 === Disc.Dark)
  );
};
