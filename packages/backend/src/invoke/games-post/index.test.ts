/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GameUsecase } from '../../application/usecase/GameUsecase';
import { ALLOW_CORS } from '../HandlerUtil';
import { handler } from './index';

// モックを作成
jest.mock('../../application/usecase/GameUsecase');

const mockGameUsecase = jest.mocked(GameUsecase);

describe('handler', () => {
  it('should return 201 if game is successfully started', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { gameId: '123' },
    } as any;

    mockGameUsecase.prototype.startNewGame.mockResolvedValue();

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(201);
    expect(result.body).toBe('Created');
    expect(result.headers).toEqual(ALLOW_CORS);
    expect(mockGameUsecase.prototype.startNewGame).toHaveBeenCalledWith('123');
  });

  it('should return 500 if an error occurs', async () => {
    const event: APIGatewayProxyEvent = {
      pathParameters: { gameId: '123' },
    } as any;

    mockGameUsecase.prototype.startNewGame.mockRejectedValue(
      new Error('Test error'),
    );

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(500);
    expect(result.body).toContain('System error');
    expect(result.headers).toEqual(ALLOW_CORS);
  });
});
