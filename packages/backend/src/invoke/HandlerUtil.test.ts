import { ApplicationError } from '../application/error/ApplicationError';
import { DomainError } from '../domain/error/DomainError';
import { ALLOW_CORS, errorResponse } from './HandlerUtil';

describe('errorResponse', () => {
  it('should return a 400 response for DomainError', () => {
    const error = new DomainError('InvalidPoint', 'The input is invalid');
    const result = errorResponse(error);

    expect(result).toEqual({
      statusCode: 400,
      headers: ALLOW_CORS,
      body: JSON.stringify({
        type: 'InvalidPoint',
        message: 'The input is invalid',
      }),
    });
  });

  it('should return a 404 response for ApplicationError of type LatestGameNotFound', () => {
    const error = new ApplicationError(
      'LatestGameNotFound',
      'Latest game not found',
    );
    const result = errorResponse(error);

    expect(result).toEqual({
      statusCode: 404,
      headers: ALLOW_CORS,
      body: JSON.stringify({
        type: 'LatestGameNotFound',
        message: 'Latest game not found',
      }),
    });
  });

  it('should return a 500 response for generic errors', () => {
    const error = new Error('Unexpected error');
    const result = errorResponse(error);

    expect(result).toEqual({
      statusCode: 500,
      headers: ALLOW_CORS,
      body: JSON.stringify({
        message: 'System error',
        error: 'Unexpected error',
      }),
    });
  });
});
