import middy from 'middy';
import env from 'middy-env';
import { cors, httpHeaderNormalizer } from 'middy/middlewares';
import { eventLogging, httpErrorHandler } from './middlewares';
/**
 * A shared handler for all functions which implements all the shared middleware
 */
export function httpHandler(handlerFunction) {
    const middyHttpHandler = middy(handlerFunction)
        .use(eventLogging())
        .use(httpErrorHandler())
        .use(cors())
        .use(httpHeaderNormalizer())
        .use(env({
        names: {
            tableName: ['TABLE_NAME', 'string'],
        },
        cache: true,
    }));
    return middyHttpHandler;
}
//# sourceMappingURL=httpHandler.js.map