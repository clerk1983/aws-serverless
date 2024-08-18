import { WinnerDisc } from './WinnerDisc';

export class GameResult {
  constructor(
    private _gameId: string,
    private _winnerDisc: WinnerDisc,
    private _endAt: string,
  ) {}

  get gameId(): string {
    return this._gameId;
  }

  get winnerDisc(): WinnerDisc {
    return this._winnerDisc;
  }

  get endAt(): string {
    return this._endAt;
  }
}
