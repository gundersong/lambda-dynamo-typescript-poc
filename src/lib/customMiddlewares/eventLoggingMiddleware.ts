import { logger } from '../logger';

export const eventLogging: middy.Middleware<any> = () => ({
  after: (handler, next) => {
    logger.info('Api Response', handler.response);
    next();
  },
  before: (handler, next) => {
    const { body, headers, pathParameters: { id } } = handler.event;
    const details = { id, body, headers };
    logger.info('Event Received', details);
    next();
  },
  onError: (handler, next) => {
    logger.error('Error thrown', handler.error);
    next(handler.error);
  },
});
