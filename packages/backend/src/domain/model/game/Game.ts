import dayjs from 'dayjs';

export class Game {
  constructor(
    private _gameId: string,
    private _createAt = dayjs().toISOString(),
  ) {}
  get gameId(): string {
    return this._gameId;
  }
  get createAt(): string {
    return this._createAt;
  }
}
