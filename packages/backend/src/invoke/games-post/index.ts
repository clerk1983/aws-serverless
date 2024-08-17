import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GameUsecase } from '../../application/GameUsecase';
import { ALLOW_CORS } from '../HandlerUtil';

/**
 * POST /tasks
 * ゲーム開始
 * @param event
 * @returns
 */
export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const game_id = event.pathParameters?.gameId;
  if (!game_id) {
    return {
      statusCode: 400,
      headers: ALLOW_CORS,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  }
  try {
    await new GameUsecase().startNewGame(game_id);
    return {
      statusCode: 201,
      headers: ALLOW_CORS,
      body: 'Created',
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: ALLOW_CORS,
      body: JSON.stringify({
        message: 'System error',
        error: (error as Error).message,
      }),
    };
  }
};
