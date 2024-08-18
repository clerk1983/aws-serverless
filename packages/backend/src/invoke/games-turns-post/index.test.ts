/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayProxyEvent } from 'aws-lambda';
import { TurnUsecase } from '../../application/usecase/TurnUsecase';
import { ALLOW_CORS } from '../HandlerUtil';
import { handler } from './index';

jest.mock('../../application/usecase/TurnUsecase');
const mockTurnUsecase = TurnUsecase as jest.MockedClass<typeof TurnUsecase>;

describe('handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 if turn is successfully registered', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { gameId: 'test-game-id' },
      body: JSON.stringify({
        turnCount: '1',
        move: { x: '0', y: '1', disc: '1' },
      }),
    } as any;

    mockTurnUsecase.prototype.registerTurn.mockResolvedValue();

    const result = await handler(event);

    expect(result.statusCode).toBe(201);
    expect(result.body).toBe('Created');
    expect(result.headers).toEqual(ALLOW_CORS);
  });
  it('should return 400 if gameId is missing', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: {},
      body: JSON.stringify({
        turnCount: '1',
        move: { x: '0', y: '1', disc: '1' },
      }),
    } as any;

    const result = await handler(event);

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe(JSON.stringify({ message: 'Invalid request' }));
    expect(result.headers).toEqual(ALLOW_CORS);
  });

  it('should return 500 if an error occurs', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { gameId: 'test-game-id' },
      body: JSON.stringify({
        turnCount: '1',
        move: { x: '0', y: '1', disc: '1' },
      }),
    } as any;

    mockTurnUsecase.prototype.registerTurn.mockRejectedValue(
      new Error('Something went wrong'),
    );

    const result = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify({
        message: 'System error',
        error: 'Something went wrong',
      }),
    );
    expect(result.headers).toEqual(ALLOW_CORS);
  });
});
