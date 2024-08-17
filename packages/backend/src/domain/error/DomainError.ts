type DomainErrorType =
  | 'SpecifiedTurnNotFound'
  | 'SelectedPointIsNotEmpty'
  | 'FlipPointIsEmpty'
  | 'SelectedDiscIsNoNextDisc'
  | 'InvalidPoint'
  | 'InvalidDiscValue'
  | 'InvalidGameId';

export class DomainError extends Error {
  constructor(
    private _type: DomainErrorType,
    message: string,
  ) {
    super(message);
  }

  get type(): DomainErrorType {
    return this._type;
  }
}
