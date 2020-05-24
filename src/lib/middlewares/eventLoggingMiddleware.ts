import { logger } from '../logger';

export const eventLogging: middy.Middleware<any> = () => ({
  after: (handler, next) => {
    logger.info('Api Response', handler.response);
    next();
  },
  before: (handler, next) => {
    try {
      const { body, headers, pathParameters } = handler.event;
      const details = { pathParameters, body, headers };
      logger.info('Event Received', details);
    } catch (e) {
      logger.error(e);
    }
    next();
  },
  onError: (handler, next) => {
    logger.error('Error thrown', handler.error);
    next(handler.error);
  },
});
