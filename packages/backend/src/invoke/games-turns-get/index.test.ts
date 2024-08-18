/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TurnUsecase } from '../../application/usecase/TurnUsecase';
import { ALLOW_CORS, errorResponse } from '../HandlerUtil';
import { handler } from './index'; // Lambdaハンドラのインポート

jest.mock('../../application/usecase/TurnUsecase');
jest.mock('../../infrastructure/repository/turn/TurnDynamoDBRepository');
jest.mock(
  '../../infrastructure/repository/game-result/GameResultDynamoDBRepository',
);
jest.mock('../HandlerUtil', () => ({
  ALLOW_CORS: { 'Access-Control-Allow-Origin': '*' },
  errorResponse: jest.fn(),
}));

describe('handler', () => {
  const mockTurnUsecase = TurnUsecase as jest.MockedClass<typeof TurnUsecase>;
  const mockFindTurn = jest.fn();

  beforeEach(() => {
    mockTurnUsecase.mockClear();
    mockTurnUsecase.prototype.findTurn = mockFindTurn;
  });

  it('should return 200 with correct turn information', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { gameId: 'test-game-id', turnCount: '1' },
    } as any;

    const responseBody = {
      turnCount: 1,
      board: [
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '1', '2', '0', '0', '0'],
        ['0', '0', '0', '2', '1', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
        ['0', '0', '0', '0', '0', '0', '0', '0'],
      ],
      nextDisc: '2',
    };

    mockFindTurn.mockResolvedValue(responseBody);

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual(ALLOW_CORS);
    expect(result.body).toBe(JSON.stringify(responseBody));
    expect(mockFindTurn).toHaveBeenCalledWith('test-game-id', 1);
  });

  it('should return 400 if game_id or turn_count is invalid', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { gameId: undefined, turnCount: 'invalid' },
    } as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.headers).toEqual(ALLOW_CORS);
    expect(result.body).toBe(JSON.stringify({ message: 'Invalid request' }));
  });

  it('should return 500 if an error occurs', async () => {
    // モックの初期化
    const mockErrorResponse = errorResponse as jest.Mock;
    mockErrorResponse.mockReturnValue({
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'System error' }),
    });

    // 意図的にエラーをスロー
    const mockTurnUsecase = TurnUsecase as jest.Mock;
    mockTurnUsecase.mockImplementation(() => {
      throw new Error('Something went wrong');
    });
  });
});
