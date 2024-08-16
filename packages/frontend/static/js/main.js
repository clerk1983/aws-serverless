const API_END_POINT =
  'https://35hjzl5ka7.execute-api.ap-northeast-1.amazonaws.com/Prod/';
const EMPTY = 0;
const DARK = 1;
const LIGHT = 2;

const INITIAL_BOARD = [
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, DARK, LIGHT, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, LIGHT, DARK, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
];

const boardElement = document.querySelector('#board');

const showBoard = async (_board) => {
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }
  _board.forEach((line) => {
    line.forEach((square) => {
      const squareElement = document.createElement('div');
      squareElement.className = 'square';
      if (square !== EMPTY) {
        const stoneElement = document.createElement('div');
        const color = square === DARK ? 'dark' : 'light';
        stoneElement.className = `stone ${color}`;
        squareElement.appendChild(stoneElement);
      }
      boardElement.appendChild(squareElement);
    });
  });
};

const registerGame = async () => {
  const result = await fetch(API_END_POINT + 'games', { method: 'POST' });
  console.info(result);
};

const main = async () => {
  await registerGame();
  await showBoard(INITIAL_BOARD);
};

main();
