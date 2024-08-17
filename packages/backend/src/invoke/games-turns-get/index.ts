import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TurnUsecase } from '../../application/TurnUsecase';
import { ALLOW_CORS } from '../HandlerUtil';

interface ResponseBody {
  turnCount: number;
  board: string[][];
  nextDisc?: string;
  winnerDisc?: string;
}

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
  try {
    const resBody: ResponseBody = await new TurnUsecase().findTurn(
      game_id,
      turn_count,
    );
    return {
      statusCode: 200,
      headers: ALLOW_CORS,
      body: JSON.stringify(resBody),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: ALLOW_CORS,
      body: JSON.stringify({
        message: 'Could not retrieve item',
        error: (error as Error).message,
      }),
    };
  }
};
