import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { TurnUsecase } from '../../application/usecase/TurnUsecase';
import { toDisc } from '../../domain/model/turn/Disc';
import { Point } from '../../domain/model/turn/Point';
import { GameResultDynamoDBRepository } from '../../infrastructure/repository/game-result/GameResultDynamoDBRepository';
import { TurnDynamoDBRepository } from '../../infrastructure/repository/turn/TurnDynamoDBRepository';
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
  try {
    console.info(`event=${JSON.stringify(event)}`);
    const game_id = event.pathParameters?.gameId;
    console.info(`game_id=${game_id}`);
    if (!game_id || !event.body) {
      return {
        statusCode: 400,
        headers: ALLOW_CORS,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }
    const body: RequestBody = JSON.parse(event.body);
    const turnCount = parseInt(body.turnCount);
    const x = parseInt(body.move.x);
    const y = parseInt(body.move.y);
    const point = new Point(x, y);
    const disc = toDisc(body.move.disc);

    const turnRepository = new TurnDynamoDBRepository();
    const gameResultRepository = new GameResultDynamoDBRepository();
    const turnUsecase = new TurnUsecase(turnRepository, gameResultRepository);
    await turnUsecase.registerTurn(game_id, turnCount, point, disc);
    return {
      statusCode: 201,
      headers: ALLOW_CORS,
      body: 'Created',
    };
  } catch (error) {
    return errorResponse(error);
  }
};
