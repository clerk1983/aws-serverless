import { AttributeValue } from '@aws-sdk/client-dynamodb';
const EMPTY = '0';
const DARK = '1';
const LIGHT = '2';
const INITIAL_BOARD: string[][] = [
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, DARK, LIGHT, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, LIGHT, DARK, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
];

it('execute', () => {
  const squareList: AttributeValue[] = [];
  INITIAL_BOARD.forEach((line, y) => {
    line.forEach((disc, x) => {
      squareList.push(genSqr(x.toString(), y.toString(), disc));
    });
  });
  console.info(JSON.stringify(squareList));
});
const genSqr = (x: string, y: string, disc: string): AttributeValue => {
  return {
    M: {
      x: { N: x },
      y: { N: y },
      disc: { N: disc },
    },
  };
};
