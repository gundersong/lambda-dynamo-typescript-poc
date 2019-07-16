import { APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { cors, jsonBodyParser } from 'middy/middlewares';
import { httpErrorHandler } from './httpErrorHandlerMiddleware';
import { storageMiddleware } from './storageMiddleware';

type HandlerFunction<T> = (event: T) => Promise<APIGatewayProxyResult>;

/**
 * A shared handler for all functions which implements all the shared middleware
 */
export function httpHandler<T>(handlerFunction: HandlerFunction<T>): middy.Middy<T, unknown> {
  const middyHttpHandler = middy(handlerFunction)
    .use(storageMiddleware())
    .use(jsonBodyParser())
    .use(httpErrorHandler())
    .use(cors());

  return middyHttpHandler;
}
