import { APIGatewayProxyResult } from 'aws-lambda';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import 'source-map-support/register';

import { httpErrorHandler } from './lib/httpErrorHandlerMiddleware';
import { storageMiddleware } from './lib/storageMiddleware';
import { IStorageAPIGatewayProxyEvent } from './types';

const deleteHandler = middy(
  async (event: IStorageAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { pathParameters: { id } } = event;

    await event.storage.delete(id);

    return { body: '', statusCode: 203 };
  })
  .use(storageMiddleware())
  .use(httpErrorHandler())
  .use(cors());

export const handler = deleteHandler;
