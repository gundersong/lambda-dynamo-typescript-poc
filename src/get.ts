import { APIGatewayProxyResult } from 'aws-lambda';
import httpErrors from 'http-errors';
import middy from 'middy';
import { cors } from 'middy/middlewares';
import 'source-map-support/register';

import { httpErrorHandler } from './lib/httpErrorHandlerMiddleware';
import { storageMiddleware } from './lib/storageMiddleware';
import { IDynamoTodo, IStorageAPIGatewayProxyEvent } from './types';

const getHandler = middy(
  async (event: IStorageAPIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const { pathParameters: { id } } = event;

    const data: IDynamoTodo = await event.storage.get(id);

    if (!data) { throw new httpErrors.NotFound(); }

    return {
      body: JSON.stringify({ data }, null, 2),
      statusCode: 200,
    };
  })
  .use(storageMiddleware())
  .use(httpErrorHandler())
  .use(cors());

export const handler = getHandler;
