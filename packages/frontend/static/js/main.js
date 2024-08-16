const API_END_POINT =
  'https://iwjublohb6.execute-api.ap-northeast-1.amazonaws.com/Prod/';
const EMPTY = '0';
const DARK = '1';
const LIGHT = '2';

const registerGame = async () => {
  const result = await fetch(`${API_END_POINT}games`, { method: 'POST' });
};

const registerTurn = async (turnCount, disc, x, y) => {
  const _body = {
    turnCount,
    disc,
    x,
    y,
  };
  const result = await fetch(`${API_END_POINT}games/latest/turns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(_body),
  });
  console.info(result);
};

const showBoard = async () => {
  const turnCount = 0;
  const response = await fetch(
    `${API_END_POINT}games/latest/turns/${turnCount}`,
    { method: 'GET' },
  );
  const resBody = await response.json();
  const board = resBody.board;
  const nextDisc = resBody.nextDisc;
  const boardElement = document.querySelector('#board');
  while (boardElement.firstChild) {
    boardElement.removeChild(boardElement.firstChild);
  }
  board.forEach((line, y) => {
    line.forEach((square, x) => {
      const squareElement = document.createElement('div');
      squareElement.className = 'square';
      if (square !== EMPTY) {
        const stoneElement = document.createElement('div');
        const color = square === DARK ? 'dark' : 'light';
        stoneElement.className = `stone ${color}`;
        squareElement.appendChild(stoneElement);
      } else {
        squareElement.addEventListener('click', async () => {
          const nextTurnCount = turnCount + 1;
          await registerTurn(nextTurnCount, nextDisc, x, y);
          showBoard();
        });
      }
      boardElement.appendChild(squareElement);
    });
  });
};

const main = async () => {
  await registerGame();
  await showBoard();
};

main();
