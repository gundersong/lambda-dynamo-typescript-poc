import { APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import 'source-map-support/register';

import { httpErrorHandler } from './lib/httpErrorHandlerMiddleware';
import { storageMiddleware } from './lib/storageMiddleware';
import { IStorageAPIGatewayProxyEvent } from './types';

const listHandler = middy(
  async (event: IStorageAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(event.path);

    return {
      body: JSON.stringify({ data: [] }, null, 2),
      statusCode: 200,
    };
  })
  .use(storageMiddleware())
  .use(httpErrorHandler());

export const handler = listHandler;
