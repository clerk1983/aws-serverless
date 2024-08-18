const API_END_POINT =
  'https://iwjublohb6.execute-api.ap-northeast-1.amazonaws.com/Prod/';
const EMPTY = '0';
const DARK = '1';
const LIGHT = '2';

const WINNER_DRAW = '0';
const WINNER_DARK = '1';
const WINNER_LIGHT = '2';

const nextDiscMessage = document.querySelector('#next-disc-message');
const warningMessageElement = document.querySelector('#warning-message');

/**
 * 新規ゲームを開始する
 */
const registerGame = async () => {
  sessionStorage.clear();
  const uuid = uuidv4();
  sessionStorage.setItem('gameId', uuid);
  await fetch(`${API_END_POINT}games/${uuid}`, {
    method: 'POST',
  });
};

/**
 * 打った手を登録する
 * @param {*} turnCount
 * @param {*} disc
 * @param {*} x
 * @param {*} y
 */
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
  return result;
};

/**
 * 盤面を取得する
 * @param {*} turnCount
 */
const showBoard = async (turnCount, previousDisc) => {
  const gameId = sessionStorage.getItem('gameId');
  const response = await fetch(
    `${API_END_POINT}games/${gameId}/turns/${turnCount}`,
    { method: 'GET' },
  );
  const resBody = await response.json();
  const board = resBody.board;
  const nextDisc = resBody.nextDisc;
  const winnerDisc = resBody.winnerDisc;

  showWarningMessage(previousDisc, nextDisc, winnerDisc);

  showNextDiscMessage(nextDisc);

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
        // ディスクを置いたら登録するようにリスナー登録
        squareElement.addEventListener('click', async () => {
          const nextTurnCount = turnCount + 1;
          const registerTurnRes = await registerTurn(
            nextTurnCount,
            nextDisc,
            x,
            y,
          );
          if (registerTurnRes.ok) {
            await showBoard(nextTurnCount, nextDisc);
          }
        });
      }
      boardElement.appendChild(squareElement);
    });
  });
};

const discToString = (disc) => {
  return disc == DARK ? '黒' : '白';
};

const showWarningMessage = (previousDisc, nextDisc, winnerDisc) => {
  const message = warningMessage(previousDisc, nextDisc, winnerDisc);
  warningMessageElement.innerHTML = message;
  if (message) {
    warningMessageElement.style.display = 'block';
  } else {
    warningMessageElement.style.display = 'none';
  }
};

const warningMessage = (previousDisc, nextDisc, winnerDisc) => {
  if (nextDisc != null) {
    if (previousDisc === nextDisc) {
      const skipped = nextDisc === DARK ? LIGHT : DARK;
      return `${discToString(skipped)}の番です`;
    } else {
      return null;
    }
  } else {
    if (winnerDisc === WINNER_DRAW) {
      return `引き分けです`;
    }
    return `${discToString(winnerDisc)}の勝ちです`;
  }
};

const showNextDiscMessage = (nextDisc) => {
  if (nextDisc) {
    const color = discToString(nextDisc);
    nextDiscMessage.innerHTML = `次は${color}の番です`;
  } else {
    nextDiscMessage.innerHTML = '';
  }
};

const main = async () => {
  await registerGame();
  await showBoard(0);
};

main();
