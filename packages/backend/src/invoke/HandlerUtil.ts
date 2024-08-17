import { DomainError } from '../domain/error/DomainError';

/**
 * Allow CORS Headers
 */
export const ALLOW_CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Headers': '*',
};

export const errorResponse = (error: Error) => {
  console.error(error);
  if (error instanceof DomainError) {
    return {
      statusCode: 400,
      headers: ALLOW_CORS,
      body: JSON.stringify({
        type: error.type,
        message: error.message,
      }),
    };
  }
  return {
    statusCode: 500,
    headers: ALLOW_CORS,
    body: JSON.stringify({
      message: 'System error',
      error: error.message,
    }),
  };
};
