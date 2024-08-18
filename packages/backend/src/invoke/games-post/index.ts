import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { GameUsecase } from '../../application/usecase/GameUsecase';
import { GameDynamoDBRepository } from '../../infrastructure/repository/game/GameDynamoDBRepository';
import { TurnDynamoDBRepository } from '../../infrastructure/repository/turn/TurnDynamoDBRepository';
import { ALLOW_CORS, errorResponse } from '../HandlerUtil';

interface PathParameters {
  gameId?: string;
}

/**
 * POST /tasks
 * ゲーム開始
 * @param event
 * @returns
 */
export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const req = event.pathParameters as PathParameters;
  const game_id = req.gameId;
  if (!game_id) {
    return {
      statusCode: 400,
      headers: ALLOW_CORS,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  }
  try {
    const turnRepository = new TurnDynamoDBRepository();
    const gameRepository = new GameDynamoDBRepository();
    const gameUsecase = new GameUsecase(gameRepository, turnRepository);

    await gameUsecase.startNewGame(game_id);
    return {
      statusCode: 201,
      headers: ALLOW_CORS,
      body: 'Created',
    };
  } catch (error) {
    return errorResponse(error as Error);
  }
};
