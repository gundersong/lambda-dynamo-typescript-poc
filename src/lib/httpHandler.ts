import middy from 'middy';
import env from 'middy-env';
import { Context } from 'aws-lambda';
import { cors, httpHeaderNormalizer } from 'middy/middlewares';
import { eventLogging, httpErrorHandler } from './middlewares';

type HandlerFunction<T, R> = (event: T, context: Context) => Promise<R>;

/**
 * A shared handler for all functions which implements all the shared middleware
 */
export function httpHandler<T, R>(
  handlerFunction: HandlerFunction<T, R>
): middy.Middy<T, R> {
  const middyHttpHandler = middy(handlerFunction)
    .use(eventLogging())
    .use(httpErrorHandler())
    .use(cors())
    .use(httpHeaderNormalizer())
    .use(
      env({
        names: {
          tableName: ['TABLE_NAME', 'string'],
        },
        cache: true,
      })
    );

  return middyHttpHandler;
}
