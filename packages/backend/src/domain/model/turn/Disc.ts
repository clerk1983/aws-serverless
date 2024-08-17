export const Disc = {
  Empty: '0',
  Dark: '1',
  Light: '2',
  Wall: '3',
} as const;

export type Disc = (typeof Disc)[keyof typeof Disc];

export const toDisc = (disc: string): Disc => {
  switch (disc) {
    case Disc.Dark:
      return Disc.Dark;
    case Disc.Light:
      return Disc.Light;
    default:
      return Disc.Empty;
  }
};

export const isOppositeDisc = (disc1: Disc, disc2: Disc): boolean => {
  return (
    (disc1 === Disc.Dark && disc2 === Disc.Light) ||
    (disc1 === Disc.Light && disc2 === Disc.Dark)
  );
};
