import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TurnUsecase } from '../../application/usecase/TurnUsecase';
import { GameResultDynamoDBRepository } from '../../infrastructure/repository/game-result/GameResultDynamoDBRepository';
import { TurnDynamoDBRepository } from '../../infrastructure/repository/turn/TurnDynamoDBRepository';
import { ALLOW_CORS, errorResponse } from '../HandlerUtil';

interface ResponseBody {
  turnCount: number;
  board: string[][];
  nextDisc?: string;
  winnerDisc?: string;
}

/**
 * 指定したターンの情報を取得する
 * @param event
 * @returns
 */
export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const game_id = event.pathParameters?.gameId;
  const turn_count = parseInt(event.pathParameters?.turnCount ?? '');
  console.info(`game_id=${game_id}, turn_count=${turn_count}`);
  if (!game_id || isNaN(turn_count)) {
    return {
      statusCode: 400,
      headers: ALLOW_CORS,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  }
  const turnRepository = new TurnDynamoDBRepository();
  const gameResultRepository = new GameResultDynamoDBRepository();
  const turnUsecase = new TurnUsecase(turnRepository, gameResultRepository);
  try {
    const resBody: ResponseBody = await turnUsecase.findTurn(
      game_id,
      turn_count,
    );
    return {
      statusCode: 200,
      headers: ALLOW_CORS,
      body: JSON.stringify(resBody),
    };
  } catch (error) {
    return errorResponse(error);
  }
};
