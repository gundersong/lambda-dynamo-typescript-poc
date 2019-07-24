import middy from 'middy';
import { cors, httpHeaderNormalizer } from 'middy/middlewares';
import { eventLogging } from './eventLoggingMiddleware';
import { httpErrorHandler } from './httpErrorHandlerMiddleware';
import { storageMiddleware } from './storageMiddleware';

type HandlerFunction<T, R> = (event: T) => Promise<R>;

/**
 * A shared handler for all functions which implements all the shared middleware
 */
export function httpHandler<T, R>(handlerFunction: HandlerFunction<T, R>): middy.Middy<T, R> {
  const middyHttpHandler = middy(handlerFunction)
    .use(storageMiddleware())
    .use(httpErrorHandler())
    .use(cors())
    .use(httpHeaderNormalizer())
    .use(eventLogging());

  return middyHttpHandler;
}
