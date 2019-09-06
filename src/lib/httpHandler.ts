import awsXRay from 'aws-xray-sdk';
import middy from 'middy';
import { cors, httpHeaderNormalizer } from 'middy/middlewares';
import { eventLogging, httpErrorHandler } from './customMiddlewares';

type HandlerFunction<T, R> = (event: T) => Promise<R>;

/**
 * A shared handler for all functions which implements all the shared middleware
 */
export function httpHandler<T, R>(handlerFunction: HandlerFunction<T, R>): middy.Middy<T, R> {
  const middyHttpHandler = middy(handlerFunction)
    .use(eventLogging())
    .use(httpErrorHandler())
    .use(cors())
    .use(httpHeaderNormalizer());

  return middyHttpHandler;
}
