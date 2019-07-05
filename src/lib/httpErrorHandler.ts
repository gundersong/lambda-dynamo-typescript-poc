import { HttpError } from 'http-errors';

export const httpErrorHandler: middy.Middleware<any> = () => ({
  onError: (handler, next) => {
    if (handler.error instanceof HttpError) {
      // as per JSON spec http://jsonapi.org/examples/#error-objects-basics
      handler.response = {
        body: JSON.stringify({
          errors: [{
            detail: handler.error.details,
            message: handler.error.message,
            status: handler.error.statusCode,
          }],
        }),
        statusCode: handler.error.statusCode,
      };
      return next();
    }

    return next(handler.error);
  },
});
