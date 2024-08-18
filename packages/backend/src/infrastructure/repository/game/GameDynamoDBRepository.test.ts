import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { Game } from '../../../domain/model/game/Game';
import { GameDynamoDBRepository } from './GameDynamoDBRepository';

jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/util-dynamodb');

describe('GameDynamoDBRepository', () => {
  const mockDynamoDbClient = new DynamoDBClient({});
  const mockSend = jest.fn();
  mockDynamoDbClient.send = mockSend;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should save the game to DynamoDB', async () => {
    // Arrange
    const game = new Game('game-id-123', '2024-08-18T12:00:00Z');
    const repository = new GameDynamoDBRepository();

    (marshall as jest.Mock).mockReturnValue({
      game_id: { S: 'game-id-123' },
      create_at: { S: '2024-08-18T12:00:00Z' },
    });

    mockSend.mockResolvedValue({});

    // Act
    await repository.save(game);

    // Assert
    expect(marshall).toHaveBeenCalledWith({
      game_id: 'game-id-123',
      create_at: '2024-08-18T12:00:00Z',
    });
  });
});
