export const Disc = {
  Empty: '0',
  Dark: '1',
  Light: '2',
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
