import { logger } from './logger';

export const eventLogging: middy.Middleware<any> = () => ({
  after: (handler, next) => {
    logger.info({
      details: handler.response.body ? JSON.parse(handler.response.body) : '',
      message: 'Api Response',
    });
    next();
  },
  before: (handler, next) => {
    const { body, headers, pathParameters: { id } } = handler.event;
    const details = { id, body, headers };
    logger.info({ details, message: 'Event Received' });

    next();
  },
  onError: (handler, next) => {
    logger.error(handler.error);
    next(handler.error);
  },
});
