import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TurnUsecase } from '../../application/TurnUsecase';
import { ALLOW_CORS, errorResponse } from '../HandlerUtil';

interface RequestBody {
  turnCount: string;
  move: {
    x: string;
    y: string;
    disc: string;
  };
}
/**
 * ターン情報を登録する
 * @param event
 * @returns
 */
export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  console.info(`event=${JSON.stringify(event)}`);
  const game_id = event.pathParameters?.gameId;
  console.info(`game_id=${game_id}`);
  if (!game_id || !event.body)
    return {
      statusCode: 400,
      headers: ALLOW_CORS,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  const body: RequestBody = JSON.parse(event.body);
  const turnCount = parseInt(body.turnCount);
  const x = parseInt(body.move.x);
  const y = parseInt(body.move.y);
  const disc = body.move.disc;
  console.info(`turnCount=${turnCount}, x=${x}, y=${y}, disc=${disc}`);

  try {
    await new TurnUsecase().registerTurn(game_id, turnCount, x, y, disc);
    return {
      statusCode: 201,
      headers: ALLOW_CORS,
      body: 'Created',
    };
  } catch (error) {
    return errorResponse(error);
  }
};
