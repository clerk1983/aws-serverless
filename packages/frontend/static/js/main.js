const API_END_POINT =
  'https://iwjublohb6.execute-api.ap-northeast-1.amazonaws.com/Prod/';
const EMPTY = '0';
const DARK = '1';
const LIGHT = '2';

const registerGame = async () => {
  sessionStorage.clear();
  const uuid = uuidv4();
  sessionStorage.setItem('gameId', uuid);
  await fetch(`${API_END_POINT}games/${uuid}`, {
    method: 'POST',
  });
};

const registerTurn = async (turnCount, disc, x, y) => {
  const gameId = sessionStorage.getItem('gameId');
  const _body = {
    turnCount,
    move: {
      disc,
      x,
      y,
    },
  };
  const result = await fetch(`${API_END_POINT}games/${gameId}/turns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(_body),
  });
};

const showBoard = async (turnCount) => {
  const gameId = sessionStorage.getItem('gameId');
  const response = await fetch(
    `${API_END_POINT}games/${gameId}/turns/${turnCount}`,
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
          await showBoard(nextTurnCount);
        });
      }
      boardElement.appendChild(squareElement);
    });
  });
};

const main = async () => {
  await registerGame();
  await showBoard(0);
};

main();
